const User = require("../models/User");
const Card = require("../models/Card");
const asyncHandler = require("express-async-handler");

const getMe = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const user = await User.findById(userId).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const cards = await Card.find({ user: userId });

  res.status(200).json({
    ...user.toObject(),
    Card: cards,
    card: cards.length > 0 ? cards[0] : null,
  });
});

const UpdateProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      name: req.body.name || user.name,
      email: req.body.email || user.email,
      phone: req.body.phone || user.phone,
    },
    {
      new: true,
    }
  ).select("-password");

  res.status(200).json({
    success: true,
    data: updatedUser,
    user: updatedUser,
  });
});

module.exports = {
  getMe,
  UpdateProfile,
};
