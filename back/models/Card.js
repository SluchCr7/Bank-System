const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    cardNumber: { type: String, required: true },
    cvv: { type: String, required: true },
    expiryDate: { type: String, required: true },
    balance: { type: Number, default: 0 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Fallback virtual for any code accessing CardNumber or expiry
cardSchema.virtual("CardNumber").get(function () {
  return this.cardNumber;
});
cardSchema.virtual("expiry").get(function () {
  return this.expiryDate;
});

const Card = mongoose.model("Card", cardSchema);
module.exports = Card;