const db = require("../models");

const Attendance = db.Attendance;
const Student = db.Student;
const User = db.User;
const Notification = db.Notification;
const Teacher = db.Teacher;
const ParentStudent = db.ParentStudent;
const { Op } = require("sequelize");


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

    if (status === "absent") {
      const links = await ParentStudent.findAll({
        where: { student_id },
        attributes: ["parent_id"]
      });

      if (links.length) {
        await Notification.bulkCreate(
          links.map((link) => ({
            parent_id: link.parent_id,
            title: "Attendance Alert",
            message: `Your child was absent on ${date}`,
            is_read: false
          }))
        );
      }
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
    const roleId = Number(req.user.role_id);

    if (!student_id) {
      return res.status(400).json({ message: "student_id is required" });
    }

    if (roleId === 2) {
      const currentStudent = await Student.findOne({ where: { user_id: req.user.id } });
      if (!currentStudent || Number(currentStudent.id) !== Number(student_id)) {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    if (roleId === 3) {
      const parent = await db.Parent.findOne({ where: { user_id: req.user.id }, attributes: ["id", "user_id"] });
      if (!parent) return res.status(403).json({ message: "Access denied" });

      const links = await ParentStudent.findAll({ where: { parent_id: parent.id } });
      const linkedIds = links.map((link) => Number(link.student_id));
      if (!linkedIds.includes(Number(student_id))) {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    if (roleId === 4) {
      const teacher = await Teacher.findOne({ where: { user_id: req.user.id } });
      if (!teacher || !teacher.class_teacher_of) return res.status(403).json({ message: "Access denied" });
      const validStudent = await Student.findOne({
        where: { id: student_id, class_id: teacher.class_teacher_of }
      });
      if (!validStudent) return res.status(403).json({ message: "Access denied" });
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
    const roleId = Number(req.user.role_id);

    if (!class_id || !date) {
      return res.status(400).json({
        message: "class_id and date are required",
      });
    }

    if (roleId === 4) {
      const teacher = await Teacher.findOne({ where: { user_id: req.user.id } });
      if (!teacher || Number(teacher.class_teacher_of) !== Number(class_id)) {
        return res.status(403).json({ message: "Access denied" });
      }
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



exports.getTeacherAttendance = async (req, res) => {
  try {
    if (req.user.role_id !== 4) {
      return res.status(403).json({ message: "Access denied" });
    }

    const teacher = await Teacher.findOne({
      where: { user_id: req.user.id },
    });

    if (!teacher || !teacher.class_teacher_of) {
      return res.json([]);
    }

    const students = await Student.findAll({
      where: { class_id: teacher.class_teacher_of },
      attributes: ["id"],
    });

    const studentIds = students.map((s) => s.id);

    const attendance = await Attendance.findAll({
      where: { student_id: { [Op.in]: studentIds } },
      include: [
        {
          model: Student,
          include: [{ model: User, attributes: ["name"] }],
        },
      ],
      order: [["date", "DESC"]],
    });

    res.json(attendance);
  } catch (err) {
    console.error("Teacher attendance error", err);
    res.status(500).json({ message: "Server error" });
  }
};
