const express = require("express");
const router = express.Router();
const { deposite, verifyDeposite } = require("../Controllers/depositeController");
const { verifyJWT } = require("../Middelwares/authMiddelwate");

router.post("/stripe", verifyJWT, deposite);
router.get("/verify", verifyJWT, verifyDeposite);

module.exports = router;
