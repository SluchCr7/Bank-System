const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    type: {
      type: String,
      required: true,
      enum: [
        "deposit",
        "withdraw",
        "transfer",
        "receive",
        "deposite-card",
        "deposit-card",
        "withdraw-card",
        "withdraw-to-card",
        "transfer-card",
        "transfer-to-card",
        "transfer-to-account",
        "purchase",
      ],
    },
    date: { type: Date, default: Date.now },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;