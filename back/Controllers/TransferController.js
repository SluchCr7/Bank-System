const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Notification = require("../models/Notification");
const asyncHandler = require("express-async-handler");

const Transfer = asyncHandler(async (req, res) => {
  const { receiverId, receiverEmail, email } = req.body;
  const amount = Number(req.body.amount);

  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error("Please enter a valid transfer amount");
  }

  const senderId = req.user._id || req.user.id;
  const sender = await User.findById(senderId);

  if (!sender) {
    res.status(404);
    throw new Error("Sender not found");
  }

  // Find receiver by id or email
  const targetEmail = (email || receiverEmail || "").trim().toLowerCase();
  let receiver = null;

  if (targetEmail) {
    receiver = await User.findOne({ email: targetEmail });
  } else if (receiverId) {
    receiver = await User.findById(receiverId);
  }

  if (!receiver) {
    res.status(404);
    throw new Error("المستلم غير موجود بالبريد الإلكتروني المدخل");
  }

  if (receiver._id.toString() === sender._id.toString()) {
    res.status(400);
    throw new Error("لا يمكنك التحويل إلى حسابك الشخصي");
  }

  if ((sender.balance || 0) < amount) {
    res.status(400);
    throw new Error("رصيد الحساب غير كافٍ لإتمام التحويل");
  }

  sender.balance -= amount;
  receiver.balance = (receiver.balance || 0) + amount;

  await sender.save();
  await receiver.save();

  // Transaction for sender
  await Transaction.create({
    user: sender._id,
    amount,
    type: "transfer",
    receiver: receiver._id,
    description: `تحويل إلى ${receiver.name} (${receiver.email})`,
  });

  // Notification for receiver
  await Notification.create({
    user: receiver._id,
    title: "تحويل وارد",
    message: `لقد استلمت تحويلاً بقيمة $${amount} من ${sender.name}`,
  });

  // Notification for sender
  await Notification.create({
    user: sender._id,
    title: "تحويل ناجح",
    message: `لقد قمت بتحويل $${amount} بنجاح إلى ${receiver.name}`,
  });

  res.status(200).json({
    success: true,
    message: "تم التحويل بنجاح",
    senderBalance: sender.balance,
    receiver: {
      _id: receiver._id,
      name: receiver.name,
      email: receiver.email,
    },
  });
});

module.exports = {
  Transfer,
};