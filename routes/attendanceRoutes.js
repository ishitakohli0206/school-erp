const express = require("express");
const router = express.Router();
const {
  markAttendance,
  getStudentAttendance
} = require("../controllers/attendanceController");
const { getClassAttendance } = require("../controllers/attendanceController");

// admin or teacher
router.post("/mark", markAttendance);

// Student-wise view
router.get("/student/:student_id", getStudentAttendance);
router.get("/class", getClassAttendance);

module.exports = router;
