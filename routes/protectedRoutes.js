const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const roleCheck = require("../middleware/roleMiddleware");

router.get("/admin", protect, roleCheck("admin"), (req, res) => {
  res.json({ message: "Admin dashboard" });
});

module.exports = router;
