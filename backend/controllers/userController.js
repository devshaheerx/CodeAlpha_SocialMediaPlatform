import mongoose from "mongoose";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadBuffer, deleteImage, isCloudinaryConfigured } from "../config/cloudinary.js";

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// GET /api/users/:username
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username.toLowerCase() });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user: user.toPublic(req.user._id) });
});

// PUT /api/users/me  (multipart: name, bio, avatar file)
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("+avatarPublicId");
  const { name, bio } = req.body;

  if (name !== undefined) user.name = name;
  if (bio !== undefined) user.bio = bio;

  if (req.file) {
    if (!isCloudinaryConfigured()) {
      return res.status(500).json({ message: "Image uploads are not configured on the server" });
    }
    const { url, publicId } = await uploadBuffer(req.file.buffer, "pulse/avatars");
    await deleteImage(user.avatarPublicId);
    user.avatar = url;
    user.avatarPublicId = publicId;
  } else if (req.body.removeAvatar === "true") {
    await deleteImage(user.avatarPublicId);
    user.avatar = "";
    user.avatarPublicId = "";
  }

  await user.save();
  res.json({ user: user.toPublic(user._id) });
});

// POST /api/users/:id/follow  (toggle)
export const toggleFollow = asyncHandler(async (req, res) => {
  const targetId = req.params.id;
  const me = req.user;

  if (!mongoose.isValidObjectId(targetId)) return res.status(404).json({ message: "User not found" });
  if (me._id.equals(targetId)) return res.status(400).json({ message: "You cannot follow yourself" });

  const target = await User.findById(targetId);
  if (!target) return res.status(404).json({ message: "User not found" });

  const alreadyFollowing = me.following.some((id) => id.equals(targetId));

  if (alreadyFollowing) {
    await User.updateOne({ _id: me._id }, { $pull: { following: target._id } });
    await User.updateOne({ _id: target._id }, { $pull: { followers: me._id } });
  } else {
    await User.updateOne({ _id: me._id }, { $addToSet: { following: target._id } });
    await User.updateOne({ _id: target._id }, { $addToSet: { followers: me._id } });
    await Notification.notify({ recipient: target._id, sender: me._id, type: "follow" });
  }

  const updated = await User.findById(target._id).select("followers");
  res.json({ isFollowing: !alreadyFollowing, followersCount: updated.followers.length });
});

const listUsers = (field) =>
  asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "User not found" });
    const user = await User.findById(req.params.id).populate(field);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ users: user[field].map((u) => u.toPublic(req.user._id)) });
  });

// GET /api/users/:id/followers
export const getFollowers = listUsers("followers");
// GET /api/users/:id/following
export const getFollowing = listUsers("following");

// GET /api/users/search?q=
export const searchUsers = asyncHandler(async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q) return res.json({ users: [] });
  const rx = new RegExp(escapeRegex(q), "i");
  const users = await User.find({ $or: [{ username: rx }, { name: rx }] }).limit(20);
  res.json({ users: users.map((u) => u.toPublic(req.user._id)) });
});

// GET /api/users/suggestions  - most-followed users you don't follow yet
export const getSuggestions = asyncHandler(async (req, res) => {
  const exclude = [req.user._id, ...req.user.following];
  // Take the 50 newest candidates, then rank by follower count
  const candidates = await User.find({ _id: { $nin: exclude } })
    .sort({ createdAt: -1 })
    .limit(50);
  const users = candidates
    .sort((a, b) => b.followers.length - a.followers.length)
    .slice(0, 5)
    .map((u) => u.toPublic(req.user._id));
  res.json({ users });
});
