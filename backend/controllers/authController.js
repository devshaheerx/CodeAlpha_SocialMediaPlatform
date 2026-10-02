import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken, { cookieOptions } from "../utils/generateToken.js";

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body;

  const exists = await User.findOne({ $or: [{ email }, { username: username.toLowerCase() }] });
  if (exists) {
    const field = exists.email === email.toLowerCase() ? "Email" : "Username";
    return res.status(400).json({ message: `${field} is already taken` });
  }

  const user = await User.create({ name, username, email, password });
  generateToken(res, user._id);
  res.status(201).json({ user: user.toPublic(user._id) });
});

// POST /api/auth/login  (accepts email or username in "identifier")
export const login = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;
  const id = identifier.toLowerCase().trim();

  const user = await User.findOne({ $or: [{ email: id }, { username: id }] }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  generateToken(res, user._id);
  res.json({ user: user.toPublic(user._id) });
});

// POST /api/auth/logout
export const logout = (req, res) => {
  const { maxAge, ...opts } = cookieOptions();
  res.clearCookie("token", opts);
  res.json({ message: "Logged out" });
};

// GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toPublic(req.user._id) });
});
