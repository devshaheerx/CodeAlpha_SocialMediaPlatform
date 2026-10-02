import Notification from "../models/Notification.js";
import asyncHandler from "../utils/asyncHandler.js";

// GET /api/notifications
export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate("sender", "username name avatar")
    .populate("post", "text image");
  const unreadCount = await Notification.countDocuments({ recipient: req.user._id, read: false });
  res.json({ notifications, unreadCount });
});

// GET /api/notifications/unread-count
export const getUnreadCount = asyncHandler(async (req, res) => {
  const unreadCount = await Notification.countDocuments({ recipient: req.user._id, read: false });
  res.json({ unreadCount });
});

// PUT /api/notifications/read
export const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ recipient: req.user._id, read: false }, { read: true });
  res.json({ message: "All notifications marked as read" });
});
