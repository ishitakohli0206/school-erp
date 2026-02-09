const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacherController");
const auth = require("../middleware/authMiddleware");

router.get("/dashboard-summary", auth, teacherController.getDashboardSummary);
router.get("/classes", auth, teacherController.getTeacherClasses);

module.exports = router;