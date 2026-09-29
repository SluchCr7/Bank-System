const Card = require("../models/Card");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

const generateCardNumber = () => {
  const prefix = "4000";
  const suffix = Math.floor(Math.random() * 1e12)
    .toString()
    .padStart(12, "0");
  return `${prefix}${suffix}`;
};

const generateCVV = () => {
  return Math.floor(Math.random() * 900 + 100).toString();
};

const generateExpiry = () => {
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
  const year = String(new Date().getFullYear() + 3).slice(-2);
  return `${month}/${year}`;
};

const createCard = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const existing = await Card.findOne({ user: userId });
  if (existing) {
    res.status(400);
    throw new Error("You already have a card");
  }

  const card = await Card.create({
    user: userId,
    cardNumber: generateCardNumber(),
    cvv: generateCVV(),
    expiryDate: generateExpiry(),
    balance: 0,
  });

  res.status(201).json(card);
});

const getMyCard = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const card = await Card.findOne({ user: userId });
  if (!card) {
    return res.status(200).json(null);
  }
  res.status(200).json(card);
});

module.exports = {
  createCard,
  getMyCard,
};