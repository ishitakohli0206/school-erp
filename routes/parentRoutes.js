const express = require("express");
const router = express.Router();

const {
  getParentDashboard,
  getChildAttendance,
  getMyChild,
  getMyChildren,
  getParentNotifications,
  getParentAcademics
} = require("../controllers/parentController");

const authMiddleware = require("../middleware/authMiddleware");
const db = require("../models");

router.get("/dashboard", authMiddleware, getParentDashboard);
router.get("/attendance", authMiddleware, getChildAttendance);
router.get("/my-child", authMiddleware, getMyChild);
router.get("/my-children", authMiddleware, getMyChildren);
router.get("/notifications", authMiddleware, getParentNotifications);
router.get("/academics", authMiddleware, getParentAcademics);

// Admin debug utility: link a parent with student using available schema
router.post("/link-student", async (req, res) => {
  try {
    const { parent_id, student_id } = req.body;
    if (!parent_id || !student_id) {
      return res.status(400).json({ message: "parent_id and student_id are required" });
    }

    const parent = await db.Parent.findByPk(parent_id);
    if (!parent) return res.status(404).json({ message: "Parent not found" });

    if (Object.prototype.hasOwnProperty.call(parent.dataValues, "student_id")) {
      parent.student_id = student_id;
      await parent.save();
    }

    await db.ParentStudent.findOrCreate({
      where: { parent_id, student_id },
      defaults: { parent_id, student_id }
    });

    return res.json({ message: "Parent linked to student successfully" });
  } catch (err) {
    console.error("Link student error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
