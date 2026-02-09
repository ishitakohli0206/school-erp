const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacherController");
const auth = require("../middleware/authMiddleware");

router.get("/dashboard-summary", auth, teacherController.getDashboardSummary);
router.get("/classes", auth, teacherController.getTeacherClasses);

router.get("/me", auth, teacherController.getMyProfile);
router.get("/students", auth, teacherController.getMyStudents);

module.exports = router;