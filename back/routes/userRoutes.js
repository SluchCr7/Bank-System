const express = require("express");
const router = express.Router();
const { getMe, UpdateProfile } = require("../Controllers/UserController");
const { verifyJWT } = require("../Middelwares/authMiddelwate");

router.get("/me", verifyJWT, getMe);
router.put("/profile", verifyJWT, UpdateProfile);

module.exports = router;
