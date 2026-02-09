const db = require("../models");

const Attendance = db.Attendance;
const Student = db.Student;
const User = db.User;
const Notification = db.Notification;


// mark attendance
exports.markAttendance = async (req, res) => {
  try {
    const { student_id, date, status } = req.body;

    if (!student_id || !date || !status) {
      return res.status(400).json({
        message: "student_id, date and status are required",
      });
    }

    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const existing = await Attendance.findOne({
      where: { student_id, date },
    });

    
    if (status === "absent" && student.parent_id) {
      await Notification.create({
        parent_id: student.parent_id,
        title: "Attendance Alert",
        message: `Your child was absent on ${date}`,
        type: "attendance",
        is_read: false,
      });
    }

    if (existing) {
      existing.status = status;
      await existing.save();

      return res.json({
        message: "Attendance updated successfully",
      });
    }

    await Attendance.create({
      student_id,
      date,
      status,
    });

    res.status(201).json({
      message: "Attendance marked successfully",
    });
  } catch (error) {
    console.error("Mark attendance error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getStudentAttendance = async (req, res) => {
  try {
    const { student_id } = req.params;

    if (!student_id) {
      return res.status(400).json({ message: "student_id is required" });
    }

    const attendance = await Attendance.findAll({
      where: { student_id },
      order: [["date", "DESC"]],
    });

    res.json(attendance);
  } catch (error) {
    console.error("Error fetching student attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getClassAttendance = async (req, res) => {
  try {
    const { class_id, date } = req.query;

    if (!class_id || !date) {
      return res.status(400).json({
        message: "class_id and date are required",
      });
    }

    const attendance = await Attendance.findAll({
      where: { date },
      include: [
        {
          model: Student,
          where: { class_id },
          attributes: ["id", "class_id"],
        },
      ],
    });

    res.json(attendance);
  } catch (error) {
    console.error("Class attendance error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAttendanceSummary = async (req, res) => {
  try {
    const totalStudents = await Student.count();
    const today = new Date().toISOString().split("T")[0];

    const presentToday = await Attendance.count({
      where: { date: today, status: "present" },
    });

    const absentToday = await Attendance.count({
      where: { date: today, status: "absent" },
    });

    const recentAttendance = await Attendance.findAll({
      limit: 5,
      order: [["date", "DESC"]],
      include: [
        {
          model: Student,
          include: [User],
        },
      ],
    });

    res.json({
      totalStudents,
      presentToday,
      absentToday,
      recentAttendance,
    });

  } catch (error) {
    console.error("Attendance summary error:", error);
    res.status(500).json({ message: "Failed to load attendance summary" });
  }
};