const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");

router.get("/profile", verifyToken, (req, res) => {
  res.status(200).json({
    message: "Profile fetched successfully",
    user: req.user
  });
});

router.get("/test", (req, res) => {
  res.send("USER ROUTE WORKING");
});
module.exports = router;

