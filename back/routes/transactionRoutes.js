const express = require("express");
const router = express.Router();
const {
  deposit,
  withdraw,
  getTransactions,
} = require("../Controllers/TransactionController");
const { verifyJWT } = require("../Middelwares/authMiddelwate");

router.get("/", verifyJWT, getTransactions);
router.post("/deposit", verifyJWT, deposit);
router.post("/withdraw", verifyJWT, withdraw);

module.exports = router;
