import mongoose from "mongoose";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import Notification from "../models/Notification.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadBuffer, deleteImage, isCloudinaryConfigured } from "../config/cloudinary.js";

const PAGE_SIZE = 10;
const AUTHOR_FIELDS = "username name avatar";

// Shared paginated query; returns { posts, hasMore }
const paginate = async (filter, req) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const posts = await Post.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE + 1)
    .populate("author", AUTHOR_FIELDS);
  const hasMore = posts.length > PAGE_SIZE;
  return {
    posts: posts.slice(0, PAGE_SIZE).map((p) => p.toPublic(req.user._id)),
    hasMore,
    page,
  };
};

// GET /api/posts/feed  - posts from people you follow + your own
export const getFeed = asyncHandler(async (req, res) => {
  const authors = [...req.user.following, req.user._id];
  res.json(await paginate({ author: { $in: authors } }, req));
});

// GET /api/posts/explore  - everyone's posts
export const getExplore = asyncHandler(async (req, res) => {
  res.json(await paginate({}, req));
});

// GET /api/posts/user/:userId
export const getUserPosts = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.userId)) return res.status(404).json({ message: "User not found" });
  res.json(await paginate({ author: req.params.userId }, req));
});

// GET /api/posts/:id
export const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate("author", AUTHOR_FIELDS);
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json({ post: post.toPublic(req.user._id) });
});

// POST /api/posts  (multipart: text, image)
export const createPost = asyncHandler(async (req, res) => {
  const text = (req.body.text || "").trim();
  if (!text && !req.file) return res.status(400).json({ message: "A post needs text or an image" });

  let image = "";
  let imagePublicId = "";
  if (req.file) {
    if (!isCloudinaryConfigured()) {
      return res.status(500).json({ message: "Image uploads are not configured on the server" });
    }
    ({ url: image, publicId: imagePublicId } = await uploadBuffer(req.file.buffer, "pulse/posts"));
  }

  const post = await Post.create({ author: req.user._id, text, image, imagePublicId });
  await post.populate("author", AUTHOR_FIELDS);
  res.status(201).json({ post: post.toPublic(req.user._id) });
});

// PUT /api/posts/:id  - edit text of own post
export const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  if (!post.author.equals(req.user._id)) return res.status(403).json({ message: "You can only edit your own posts" });

  const text = (req.body.text || "").trim();
  if (!text && !post.image) return res.status(400).json({ message: "A post needs text or an image" });

  post.text = text;
  post.edited = true;
  await post.save();
  await post.populate("author", AUTHOR_FIELDS);
  res.json({ post: post.toPublic(req.user._id) });
});

// DELETE /api/posts/:id  - also removes comments, notifications and the image
export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).select("+imagePublicId");
  if (!post) return res.status(404).json({ message: "Post not found" });
  if (!post.author.equals(req.user._id)) return res.status(403).json({ message: "You can only delete your own posts" });

  await Promise.all([
    Comment.deleteMany({ post: post._id }),
    Notification.deleteMany({ post: post._id }),
    deleteImage(post.imagePublicId),
  ]);
  await post.deleteOne();
  res.json({ message: "Post deleted", id: post._id });
});

// POST /api/posts/:id/like  (toggle)
export const toggleLike = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const liked = post.likes.some((id) => id.equals(req.user._id));
  const update = liked ? { $pull: { likes: req.user._id } } : { $addToSet: { likes: req.user._id } };
  await Post.updateOne({ _id: post._id }, update);
  const updated = await Post.findById(post._id).select("likes");

  if (!liked) {
    await Notification.notify({ recipient: post.author, sender: req.user._id, type: "like", post: post._id });
  }

  res.json({ isLiked: !liked, likesCount: updated.likes.length });
});
