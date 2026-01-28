const express = require("express");
const router = express.Router();
const {
  markAttendance,
  getStudentAttendance
} = require("../controllers/attendanceController");
const { getClassAttendance } = require("../controllers/attendanceController");

// admin or teacher
router.post("/mark", (req, res, next) => {
  console.log("MARK ATTENDANCE API HIT");
  next();
}, markAttendance);

// Student-wise view
router.get("/student/:student_id", getStudentAttendance);
router.get("/class", getClassAttendance);

module.exports = router;
