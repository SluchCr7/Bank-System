const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Notification = require("../models/Notification");
const Transaction = require("../models/Transaction");

const deposit = asyncHandler(async (req, res) => {
  const amount = Number(req.body.amount);
  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error("Please enter a valid amount");
  }

  const userId = req.user._id || req.user.id;
  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.balance = (user.balance || 0) + amount;
  await user.save();

  const transaction = await Transaction.create({
    user: userId,
    amount,
    type: "deposit",
    description: "إيداع في الحساب",
  });

  await Notification.create({
    user: userId,
    title: "إيداع ناجح",
    message: `تم إيداع $${amount} بنجاح في حسابك`,
  });

  res.json({
    success: true,
    message: "Deposit successful",
    balance: user.balance,
    transaction,
  });
});

const withdraw = asyncHandler(async (req, res) => {
  const amount = Number(req.body.amount);
  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error("Please enter a valid amount");
  }

  const userId = req.user._id || req.user.id;
  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if ((user.balance || 0) < amount) {
    res.status(400);
    throw new Error("Insufficient balance");
  }

  user.balance -= amount;
  await user.save();

  const transaction = await Transaction.create({
    user: userId,
    amount,
    type: "withdraw",
    description: "سحب من الحساب",
  });

  await Notification.create({
    user: userId,
    title: "سحب ناجح",
    message: `تم سحب $${amount} من حسابك`,
  });

  res.json({
    success: true,
    message: "Withdraw successful",
    balance: user.balance,
    transaction,
  });
});

const getTransactions = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const transactions = await Transaction.find({
    $or: [{ user: userId }, { receiver: userId }],
  })
    .sort({ createdAt: -1 })
    .populate("receiver", "name email");

  res.json(transactions);
});

module.exports = {
  deposit,
  withdraw,
  getTransactions,
};