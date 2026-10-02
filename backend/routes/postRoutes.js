import { Router } from "express";
import { body } from "express-validator";
import {
  getFeed,
  getExplore,
  getUserPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
} from "../controllers/postController.js";
import { getComments, addComment } from "../controllers/commentController.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import validate from "../middleware/validate.js";

const router = Router();
router.use(protect);

const textRule = body("text").optional().isLength({ max: 500 }).withMessage("Post must be 500 characters or less");

router.get("/feed", getFeed);
router.get("/explore", getExplore);
router.get("/user/:userId", getUserPosts);

router.post("/", upload.single("image"), [textRule], validate, createPost);
router.get("/:id", getPost);
router.put("/:id", [textRule], validate, updatePost);
router.delete("/:id", deletePost);
router.post("/:id/like", toggleLike);

router.get("/:id/comments", getComments);
router.post(
  "/:id/comments",
  [
    body("text")
      .trim()
      .notEmpty()
      .withMessage("Comment cannot be empty")
      .isLength({ max: 300 })
      .withMessage("Comment must be 300 characters or less"),
  ],
  validate,
  addComment
);

export default router;
