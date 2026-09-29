const express = require("express");
const router = express.Router();
const {
  getNotificationsByUser,
  markAsRead,
  deleteNotification,
} = require("../Controllers/NotificationController");
const { verifyJWT } = require("../Middelwares/authMiddelwate");

router.get("/", verifyJWT, getNotificationsByUser);
router.put("/:id/read", verifyJWT, markAsRead);
router.delete("/:id", verifyJWT, deleteNotification);

module.exports = router;
