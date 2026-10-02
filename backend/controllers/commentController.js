import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import Notification from "../models/Notification.js";
import asyncHandler from "../utils/asyncHandler.js";

const AUTHOR_FIELDS = "username name avatar";

// GET /api/posts/:id/comments
export const getComments = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const comments = await Comment.find({ post: post._id })
    .sort({ createdAt: 1 })
    .populate("author", AUTHOR_FIELDS);
  res.json({ comments });
});

// POST /api/posts/:id/comments
export const addComment = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const comment = await Comment.create({ post: post._id, author: req.user._id, text: req.body.text });
  await Post.updateOne({ _id: post._id }, { $inc: { commentsCount: 1 } });
  await Notification.notify({ recipient: post.author, sender: req.user._id, type: "comment", post: post._id });

  await comment.populate("author", AUTHOR_FIELDS);
  res.status(201).json({ comment });
});

// DELETE /api/comments/:id  (comment author or post owner)
export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: "Comment not found" });

  const post = await Post.findById(comment.post);
  const isCommentAuthor = comment.author.equals(req.user._id);
  const isPostOwner = post && post.author.equals(req.user._id);
  if (!isCommentAuthor && !isPostOwner) {
    return res.status(403).json({ message: "Not allowed to delete this comment" });
  }

  await comment.deleteOne();
  if (post) await Post.updateOne({ _id: post._id, commentsCount: { $gt: 0 } }, { $inc: { commentsCount: -1 } });
  res.json({ message: "Comment deleted", id: comment._id });
});
