const { Teacher, Class, Student, Attendance, User } = require("../models");
const { Op } = require("sequelize");

/**
 * DASHBOARD SUMMARY
 */
exports.getDashboardSummary = async (req, res) => {
  try {
    if (req.user.role_id !== 4) {
      return res.status(403).json({ message: "Access denied" });
    }

    const teacher = await Teacher.findOne({
      where: { user_id: req.user.id }
    });

    if (!teacher || !teacher.class_teacher_of) {
      return res.json({
        totalStudents: 0,
        totalClasses: 0,
        presentToday: 0,
        absentToday: 0
      });
    }

    const classId = teacher.class_teacher_of;

    const totalStudents = await Student.count({
      where: { class_id: classId }
    });

    const today = new Date().toISOString().split("T")[0];

    const presentToday = await Attendance.count({
      where: { date: today, status: "present" },
      include: [{ model: Student, where: { class_id: classId } }]
    });

    const absentToday = await Attendance.count({
      where: { date: today, status: "absent" },
      include: [{ model: Student, where: { class_id: classId } }]
    });

    res.json({
      totalStudents,
      totalClasses: 1,
      presentToday,
      absentToday
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * MY STUDENTS (ADMIN JAISE)
 */
exports.getMyStudents = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({
      where: { user_id: req.user.id }
    });

    if (!teacher || !teacher.class_teacher_of) {
      return res.json([]);
    }

    const students = await Student.findAll({
      where: { class_id: teacher.class_teacher_of },
      include: [
        { model: User, attributes: ["id", "name", "email"] },
        { model: Class, attributes: ["class_name", "section"] }
      ]
    });

    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * TEACHER CLASSES
 */
exports.getTeacherClasses = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({
      where: { user_id: req.user.id }
    });

    if (!teacher || !teacher.class_teacher_of) {
      return res.json([]);
    }

    const cls = await Class.findByPk(teacher.class_teacher_of);
    res.json([cls]);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch classes" });
  }
};

/**
 * PROFILE
 */
exports.getMyProfile = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({
      where: { user_id: req.user.id }
    });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json(teacher);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};