import { Router } from "express";
import { getNotifications, getUnreadCount, markAllRead } from "../controllers/notificationController.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.use(protect);

router.get("/", getNotifications);
router.get("/unread-count", getUnreadCount);
router.put("/read", markAllRead);

export default router;
