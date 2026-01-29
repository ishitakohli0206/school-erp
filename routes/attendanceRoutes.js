const express = require("express");
const router = express.Router();
const {
  markAttendance,
  getStudentAttendance,
  getClassAttendance
} = require("../controllers/attendanceController");

// Log all attendance requests
router.use((req, res, next) => {
  console.log(`[Attendance Routes] ${req.method} ${req.path}`);
  next();
});

// Debug endpoint
router.get("/debug", (req, res) => {
  res.json({ message: "Attendance routes are working" });
});

// admin or teacher
router.post("/mark", (req, res, next) => {
  console.log("MARK ATTENDANCE API HIT");
  next();
}, markAttendance);

// Student-wise view
router.get("/student/:student_id", (req, res, next) => {
  console.log("GET STUDENT ATTENDANCE - Params:", req.params);
  next();
}, getStudentAttendance);

// Class-wise view
router.get("/class", getClassAttendance);

module.exports = router;
