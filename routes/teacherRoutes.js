const express = require("express");
const router = express.Router();

const teacherController = require("../controllers/teacherController");
const authMiddleware = require("../middleware/authMiddleware");

router.get(
  "/dashboard-summary",
  authMiddleware,
  teacherController.getDashboardSummary
);


router.get(
  "/students",
  authMiddleware,
  teacherController.getMyStudents
);


router.get(
  "/classes",
  authMiddleware,
  teacherController.getTeacherClasses
);


router.get(
  "/profile",
  authMiddleware,
  teacherController.getMyProfile
);

module.exports = router;