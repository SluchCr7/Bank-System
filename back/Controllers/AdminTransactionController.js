const Transaction = require("../models/Transaction");
const asyncHandler = require("express-async-handler");

const getAllTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });
  res.json(transactions);
});

module.exports = {
  getAllTransactions,
};