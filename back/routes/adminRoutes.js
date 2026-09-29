const express = require("express");
const router = express.Router();
const { getAllCards } = require("../Controllers/AdminCardController");
const { getAllTransactions } = require("../Controllers/AdminTransactionController");
const {
  getAllUsers,
  deleteUser,
  updateUserBalance,
  makeIsAdmin,
} = require("../Controllers/AdminUserController");
const { verifyJWT, adminOnly } = require("../Middelwares/authMiddelwate");

// Protect all admin endpoints: user must be authenticated AND have isAdmin === true
router.use(verifyJWT, adminOnly);

router.get("/cards", getAllCards);
router.get("/transactions", getAllTransactions);
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/admin", makeIsAdmin);
router.put("/users/:id/balance", updateUserBalance);

module.exports = router;

