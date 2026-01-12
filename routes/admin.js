const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminmiddleware");

router.get("/dashboard", verifyToken, isAdmin, (req, res) => {
  res.json({ message: "Admin dashboard working" });
});

module.exports = router;
