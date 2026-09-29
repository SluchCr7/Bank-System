const User = require("../models/User");
const asyncHandler = require("express-async-handler");

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User removed" });
});

const updateUserBalance = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  user.balance = Number(req.body.balance);
  await user.save();
  res.json({ message: "Balance updated successfully", balance: user.balance });
});

const makeIsAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  const newStatus =
    req.body && req.body.isAdmin !== undefined ? Boolean(req.body.isAdmin) : true;
  user.isAdmin = newStatus;
  await user.save();
  res.json({
    success: true,
    message: newStatus
      ? "تمت ترقية المستخدم إلى مسؤول بنجاح"
      : "تم إلغاء صلاحيات الإدارة بنجاح",
    isAdmin: user.isAdmin,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
  });
});

module.exports = {
  getAllUsers,
  deleteUser,
  updateUserBalance,
  makeIsAdmin
};