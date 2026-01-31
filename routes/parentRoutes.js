const express = require("express");
const router = express.Router();

const {
  getParentDashboard,
  getChildAttendance,
  getMyChild
} = require("../controllers/parentController");

const authMiddleware = require("../middleware/authMiddleware");


router.get("/dashboard", authMiddleware, getParentDashboard);


router.get("/attendance", authMiddleware, getChildAttendance);


router.get("/my-child", authMiddleware, getMyChild);

// ADMIN DEBUG: Link a parent to a student (for testing)
router.post("/link-student", async (req, res) => {
  try {
    const { parent_id, student_id } = req.body;

    if (!parent_id || !student_id) {
      return res.status(400).json({ message: "parent_id and student_id are required" });
    }

    const db = require("../models");
    const Parent = db.Parent;

    const parent = await Parent.findByPk(parent_id);
    if (!parent) {
      return res.status(404).json({ message: "Parent not found" });
    }

    parent.student_id = student_id;
    await parent.save();

    res.json({ message: "Parent linked to student successfully", parent });
  } catch (err) {
    console.error("Link student error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ADMIN DEBUG: Get all parents with their students
router.get("/debug/all-parents", async (req, res) => {
  try {
    const db = require("../models");
    const Parent = db.Parent;
    const User = db.User;

    const parents = await Parent.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"]
        }
      ],
      raw: true
    });

    res.json({ 
      count: parents.length,
      parents 
    });
  } catch (err) {
    console.error("Debug parents error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ADMIN DEBUG: Check a specific parent's data
router.get("/debug/parent/:userId", async (req, res) => {
  try {
    const db = require("../models");
    const Parent = db.Parent;
    const User = db.User;
    const Student = db.Student;
    const Attendance = db.Attendance;

    const user = await User.findByPk(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const parent = await Parent.findOne({
      where: { user_id: req.params.userId },
      raw: true
    });

    if (!parent) {
      return res.status(404).json({ message: "Parent not found" });
    }

    let student = null;
    let attendance = [];

    if (parent.student_id) {
      student = await Student.findByPk(parent.student_id, {
        include: [{ model: User, attributes: ["name", "email"] }],
        raw: true
      });

      attendance = await Attendance.findAll({
        where: { student_id: parent.student_id },
        raw: true
      });
    }

    res.json({ 
      user,
      parent,
      student,
      attendanceCount: attendance.length,
      attendanceSample: attendance.slice(0, 3)
    });
  } catch (err) {
    console.error("Debug parent error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
