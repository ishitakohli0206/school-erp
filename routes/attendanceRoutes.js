const express = require("express");
const router = express.Router();

const {
  markAttendance,
  getStudentAttendance,
  getClassAttendance,
  getAttendanceSummary,
  getTeacherAttendance
} = require("../controllers/attendanceController");
const authMiddleware = require("../middleware/authMiddleware");


router.use((req, res, next) => {
  console.log(`[Attendance Routes] ${req.method} ${req.path}`);
  next();
});

// Debug endpoint
router.get("/debug", (req, res) => {
  res.json({ message: "Attendance routes are working" });
});

// SUMMARY ROUTE (FOR REPORTS & DASHBOARD)
router.get("/summary", getAttendanceSummary);

// Admin or teacher – mark attendance
router.post(
  "/mark",
  (req, res, next) => {
    console.log("MARK ATTENDANCE API HIT");
    next();
  },
  markAttendance
);

// Student-wise attendance
router.get(
  "/student/:student_id",
  (req, res, next) => {
    console.log("GET STUDENT ATTENDANCE - Params:", req.params);
    next();
  },
  getStudentAttendance
);

// Class-wise attendance
router.get("/class", getClassAttendance);

router.get(
  "/teacher",
  authMiddleware,
  getTeacherAttendance
);

module.exports = router;
