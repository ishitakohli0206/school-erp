const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getMyProfile } = require("../controllers/profileController");

router.get("/me", authMiddleware, getMyProfile);

module.exports = router;
