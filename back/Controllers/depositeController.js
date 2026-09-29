const stripe = require("stripe");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Notification = require("../models/Notification");
const Transaction = require("../models/Transaction");

const deposite = asyncHandler(async (req, res) => {
  const amount = Number(req.body.amount);
  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error("Please enter a valid amount");
  }

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.startsWith("sk_test_placeholder")) {
    // If Stripe key is placeholder, simulate redirect to verify-deposit for seamless local testing
    return res.status(200).json({
      success: true,
      url: `${frontendUrl}/Pages/Verify-deposite?success=true&amount=${amount}`,
    });
  }

  const Stripe = new stripe(process.env.STRIPE_SECRET_KEY);

  const session = await Stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "إيداع في الحساب المصرفي PFB",
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${frontendUrl}/Pages/Verify-deposite?success=true&amount=${amount}`,
    cancel_url: `${frontendUrl}/Pages/Verify-deposite?success=false`,
  });

  res.status(200).json({ success: true, url: session.url });
});

const verifyDeposite = asyncHandler(async (req, res) => {
  const { success, amount } = req.query;
  const userId = req.user._id || req.user.id;
  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (success === "true") {
    const depositAmount = Number(amount);
    if (!depositAmount || depositAmount <= 0) {
      res.status(400);
      throw new Error("Invalid deposit amount");
    }

    user.balance = (user.balance || 0) + depositAmount;
    await user.save();

    await Transaction.create({
      user: user._id,
      amount: depositAmount,
      type: "deposit",
      description: "إيداع عبر Stripe",
    });

    await Notification.create({
      user: user._id,
      title: "إيداع ناجح",
      message: `تم إيداع $${depositAmount} بنجاح في حسابك`,
    });

    return res.status(200).json({ success: true, balance: user.balance });
  } else {
    await Notification.create({
      user: user._id,
      title: "فشل الإيداع",
      message: `فشلت عملية الإيداع عبر Stripe`,
    });
    return res.status(200).json({ success: false, message: "Deposit cancelled or failed" });
  }
});

module.exports = {
  deposite,
  verifyDeposite,
};