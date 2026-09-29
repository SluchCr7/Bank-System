const Notification = require("../models/Notification");
const asyncHandler = require("express-async-handler");

// @desc    Get all notifications for current user
// @route   GET /api/notifications
// @access  Private
const getNotificationsByUser = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const notifications = await Notification.find({ user: userId }).sort({
    createdAt: -1,
  });
  res.status(200).json(notifications);
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  const userId = (req.user._id || req.user.id).toString();
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error("الإشعار غير موجود");
  }

  if (notification.user.toString() !== userId) {
    res.status(401);
    throw new Error("غير مصرح لك بتعديل هذا الإشعار");
  }

  notification.read = true;
  const updatedNotification = await notification.save();

  res.status(200).json(updatedNotification);
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = asyncHandler(async (req, res) => {
  const userId = (req.user._id || req.user.id).toString();
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    res.status(404);
    throw new Error("الإشعار غير موجود");
  }

  if (notification.user.toString() !== userId) {
    res.status(401);
    throw new Error("غير مصرح لك بحذف هذا الإشعار");
  }

  await notification.deleteOne();
  res.status(200).json({ id: req.params.id, message: "تم حذف الإشعار بنجاح" });
});

module.exports = {
  getNotificationsByUser,
  markAsRead,
  deleteNotification,
};