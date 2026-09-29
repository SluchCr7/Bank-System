const express = require("express");
const router = express.Router();
const { createCard, getMyCard } = require("../Controllers/CardController");
const { verifyJWT } = require("../Middelwares/authMiddelwate");

router.post("/", verifyJWT, createCard);
router.get("/my-card", verifyJWT, getMyCard);

module.exports = router;
