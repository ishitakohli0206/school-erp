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

router.post(
  "/parent-updates",
  authMiddleware,
  teacherController.sendParentUpdate
);

router.get(
  "/quiz-links",
  authMiddleware,
  teacherController.getQuizLinks
);

router.post(
  "/quiz-links",
  authMiddleware,
  teacherController.createQuizLink
);

module.exports = router;
