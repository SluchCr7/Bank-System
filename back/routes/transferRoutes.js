const express = require("express");
const router = express.Router();
const { Transfer } = require("../Controllers/TransferController");
const { verifyJWT } = require("../Middelwares/authMiddelwate");

router.post("/", verifyJWT, Transfer);

module.exports = router;
