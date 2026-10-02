import { Router } from "express";
import { body } from "express-validator";
import rateLimit from "express-rate-limit";
import { register, login, logout, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import validate from "../middleware/validate.js";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { message: "Too many attempts, please try again later" },
});

router.post(
  "/register",
  authLimiter,
  [
    body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 50 }),
    body("username")
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage("Username must be 3-20 characters")
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage("Username can only contain letters, numbers and underscores"),
    body("email").trim().isEmail().withMessage("Enter a valid email").toLowerCase(),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  validate,
  register
);

router.post(
  "/login",
  authLimiter,
  [
    body("identifier").trim().notEmpty().withMessage("Email or username is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  login
);

router.post("/logout", logout);
router.get("/me", protect, getMe);

export default router;
