const Card = require("../models/Card");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Notification = require("../models/Notification");

// Helper to find card by id or by user
const resolveCard = async (paramId, userId) => {
  if (paramId && paramId !== "default" && paramId !== "my-card") {
    const card = await Card.findById(paramId);
    if (card) return card;
  }
  return await Card.findOne({ user: userId });
};

const depositeToCard = asyncHandler(async (req, res) => {
  const amount = Number(req.body.amount);
  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error("Please enter a valid amount");
  }

  const userId = req.user._id || req.user.id;
  const card = await resolveCard(req.params.id, userId);

  if (!card) {
    res.status(404);
    throw new Error("Card not found");
  }

  card.balance = (card.balance || 0) + amount;
  await card.save();

  await Transaction.create({
    user: userId,
    amount,
    type: "deposit-card",
    receiver: card._id,
  });

  await Notification.create({
    user: userId,
    title: "إيداع في البطاقة",
    message: `تم إيداع $${amount} في بطاقتك البنكية`,
  });

  res.json({
    success: true,
    cardBalance: card.balance,
    message: "Deposit to card successful",
  });
});

const withdrawFromCard = asyncHandler(async (req, res) => {
  const amount = Number(req.body.amount);
  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error("Please enter a valid amount");
  }

  const userId = req.user._id || req.user.id;
  const card = await resolveCard(req.params.id, userId);

  if (!card) {
    res.status(404);
    throw new Error("Card not found");
  }
  if ((card.balance || 0) < amount) {
    res.status(400);
    throw new Error("Insufficient card balance");
  }

  card.balance -= amount;
  await card.save();

  await Transaction.create({
    user: userId,
    amount,
    type: "withdraw-card",
    receiver: card._id,
  });

  await Notification.create({
    user: userId,
    title: "سحب من البطاقة",
    message: `تم سحب $${amount} من بطاقتك البنكية`,
  });

  res.json({
    success: true,
    cardBalance: card.balance,
    message: "Withdraw from card successful",
  });
});

const getCardBalance = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const card = await resolveCard(req.params.id, userId);
  if (!card) {
    res.status(404);
    throw new Error("Card not found");
  }
  res.json({ balance: card.balance, cardNumber: card.cardNumber });
});

const transferToCard = asyncHandler(async (req, res) => {
  const amount = Number(req.body.amount);
  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error("Please enter a valid amount");
  }

  const userId = req.user._id || req.user.id;
  const user = await User.findById(userId);
  const card = await resolveCard(req.params.id, userId);

  if (!card) {
    res.status(404);
    throw new Error("Card not found. Please create a card first.");
  }
  if (user.balance < amount) {
    res.status(400);
    throw new Error("Insufficient account balance");
  }

  user.balance -= amount;
  card.balance = (card.balance || 0) + amount;

  await user.save();
  await card.save();

  await Transaction.create({
    user: userId,
    amount,
    type: "transfer-to-card",
    receiver: card._id,
  });

  await Notification.create({
    user: userId,
    title: "شحن البطاقة",
    message: `تم تحويل $${amount} من حسابك إلى بطاقتك البنكية`,
  });

  res.json({
    success: true,
    userBalance: user.balance,
    cardBalance: card.balance,
    message: "Transfer to card successful",
  });
});

const tranferToAccount = asyncHandler(async (req, res) => {
  const amount = Number(req.body.amount);
  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error("Please enter a valid amount");
  }

  const userId = req.user._id || req.user.id;
  const user = await User.findById(userId);
  const card = await resolveCard(req.params.id, userId);

  if (!card) {
    res.status(404);
    throw new Error("Card not found");
  }
  if ((card.balance || 0) < amount) {
    res.status(400);
    throw new Error("Insufficient card balance");
  }

  card.balance -= amount;
  user.balance = (user.balance || 0) + amount;

  await user.save();
  await card.save();

  await Transaction.create({
    user: userId,
    amount,
    type: "transfer-to-account",
    receiver: user._id,
  });

  await Notification.create({
    user: userId,
    title: "تحويل إلى الحساب",
    message: `تم تحويل $${amount} من بطاقتك إلى حسابك البنكي`,
  });

  res.json({
    success: true,
    userBalance: user.balance,
    cardBalance: card.balance,
    message: "Transfer to account successful",
  });
});

module.exports = {
  depositeToCard,
  withdrawFromCard,
  withdeawFromCard: withdrawFromCard,
  getCardBalance,
  transferToCard,
  tranferToAccount,
};
