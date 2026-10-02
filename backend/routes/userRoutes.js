import { Router } from "express";
import { body } from "express-validator";
import {
  getProfile,
  updateProfile,
  toggleFollow,
  getFollowers,
  getFollowing,
  searchUsers,
  getSuggestions,
} from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import validate from "../middleware/validate.js";

const router = Router();
router.use(protect);

// Static routes first so they aren't captured by /:username
router.get("/search", searchUsers);
router.get("/suggestions", getSuggestions);
router.put(
  "/me",
  upload.single("avatar"),
  [
    body("name").optional().trim().notEmpty().withMessage("Name cannot be empty").isLength({ max: 50 }),
    body("bio").optional().isLength({ max: 160 }).withMessage("Bio must be 160 characters or less"),
  ],
  validate,
  updateProfile
);

router.post("/:id/follow", toggleFollow);
router.get("/:id/followers", getFollowers);
router.get("/:id/following", getFollowing);
router.get("/:username", getProfile);

export default router;
