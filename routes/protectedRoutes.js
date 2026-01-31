const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const roleCheck = require("../middleware/rolemiddleware");
const parentController = require("../controllers/parentController");

router.get("/admin", protect, roleCheck("admin"), (req, res) => {
  res.json({ message: "Admin dashboard" });
});
router.get("/dashboard", protect, parentController.getParentDashboard);
router.get("/attendance", protect, parentController.getChildAttendance);
module.exports = router;
