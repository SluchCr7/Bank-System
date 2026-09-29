const express = require("express");
const router = express.Router();
const {
  depositeToCard,
  withdrawFromCard,
  getCardBalance,
  transferToCard,
  tranferToAccount,
} = require("../Controllers/CardTransactionController");
const { verifyJWT } = require("../Middelwares/authMiddelwate");

// Allow operations with card id parameter or without (defaults to user's card)
router.post("/deposit", verifyJWT, depositeToCard);
router.post("/deposit/:id", verifyJWT, depositeToCard);

router.post("/withdraw", verifyJWT, withdrawFromCard);
router.post("/withdraw/:id", verifyJWT, withdrawFromCard);

router.get("/balance", verifyJWT, getCardBalance);
router.get("/balance/:id", verifyJWT, getCardBalance);

router.post("/transfer-to-card", verifyJWT, transferToCard);
router.post("/transfer-to-card/:id", verifyJWT, transferToCard);

router.post("/transfer-to-account", verifyJWT, tranferToAccount);
router.post("/transfer-to-account/:id", verifyJWT, tranferToAccount);

module.exports = router;
