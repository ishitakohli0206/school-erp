const express = require("express");
const router = express.Router();
const {
  addStudent,
  getAllStudents,
  getStudentsByClass,
  getStudentsDetailed
} = require("../controllers/studentController");

// ADMIN
router.post("/add", addStudent);
router.get("/", getAllStudents);
router.get("/class/:classId", getStudentsByClass);
router.get("/detailed", getStudentsDetailed);
module.exports = router;
