const { Teacher, Class, Student, Attendance, User, ParentStudent, Notification, QuizLink } = require("../models");
const { Op } = require("sequelize");

const normalizeGoogleFormUrl = (value) => {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  if (raw.startsWith("forms.gle/") || raw.startsWith("docs.google.com/forms/")) {
    return `https://${raw}`;
  }
  return raw;
};

const isGoogleFormUrl = (value) => {
  try {
    const parsed = new URL(value);
    return (
      parsed.protocol === "https:" &&
      (parsed.hostname === "forms.gle" ||
        parsed.hostname === "docs.google.com") &&
      (parsed.hostname === "forms.gle" || parsed.pathname.startsWith("/forms/"))
    );
  } catch (error) {
    return false;
  }
};

const isMicrosoftFormUrl = (value) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" && (parsed.hostname === "forms.office.com" || parsed.hostname === "forms.cloud.microsoft.com");
  } catch (error) {
    return false;
  }
};


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

exports.sendParentUpdate = async (req, res) => {
  try {
    if (Number(req.user.role_id) !== 4) {
      return res.status(403).json({ message: "Teacher access required" });
    }

    const { title, message, student_id } = req.body;
    if (!title || !message) {
      return res.status(400).json({ message: "title and message are required" });
    }

    const teacher = await Teacher.findOne({ where: { user_id: req.user.id } });
    if (!teacher || !teacher.class_teacher_of) {
      return res.status(400).json({ message: "Teacher class assignment missing" });
    }

    let studentIds = [];
    if (student_id) {
      const student = await Student.findOne({
        where: { id: student_id, class_id: teacher.class_teacher_of }
      });
      if (!student) {
        return res.status(403).json({ message: "Student not in your assigned class" });
      }
      studentIds = [student.id];
    } else {
      const students = await Student.findAll({
        where: { class_id: teacher.class_teacher_of },
        attributes: ["id"]
      });
      studentIds = students.map((row) => row.id);
    }

    if (!studentIds.length) {
      return res.status(400).json({ message: "No students found for communication" });
    }

    const links = await ParentStudent.findAll({
      where: { student_id: { [Op.in]: studentIds } }
    });

    if (!links.length) {
      return res.status(200).json({ message: "No linked parents found for selected students" });
    }

    await Notification.bulkCreate(
      links.map((link) => ({
        parent_id: link.parent_id,
        title,
        message,
        is_read: false,
        created_at: new Date()
      }))
    );

    return res.status(201).json({ message: "Parent update sent successfully" });
  } catch (error) {
    console.error("sendParentUpdate error:", error);
    return res.status(500).json({ message: "Failed to send parent update" });
  }
};

exports.createQuizLink = async (req, res) => {
  try {
    if (Number(req.user.role_id) !== 4) {
      return res.status(403).json({ message: "Teacher access required" });
    }

    const { title, url } = req.body;
    if (!title || !url) {
      return res.status(400).json({ message: "title and url are required" });
    }


    const rawUrl = String(url || "").trim();
    const lowerRaw = rawUrl.toLowerCase();
    const normalizedUrl = normalizeGoogleFormUrl(url);
    console.log('QUIZ DEBUG:', {
      inputUrl: url,
      rawUrl,
      lowerRaw,
      normalizedUrl,
      isGoogle: isGoogleFormUrl(normalizedUrl),
      isMS: isMicrosoftFormUrl(rawUrl),
      containsMS: lowerRaw.includes('forms.cloud.microsoft') || lowerRaw.includes('forms.office')
    });
    
    const isValid = isGoogleFormUrl(normalizedUrl) || isMicrosoftFormUrl(rawUrl) || lowerRaw.includes('forms.office') || lowerRaw.includes('forms.cloud.microsoft') || lowerRaw.includes('forms.gle');
    if (!isValid) {
      return res.status(400).json({ message: "Please provide a valid Google Form or Microsoft Form link. Debug logged to console." });
    }

    const finalUrl = normalizedUrl || rawUrl;


    const teacher = await Teacher.findOne({ where: { user_id: req.user.id } });
    if (!teacher) {
      return res.status(400).json({ message: "Teacher profile not found" });
    }

    const created = await QuizLink.create({
      title: String(title).trim(),
      url: finalUrl,
      class_id: teacher.class_teacher_of ? Number(teacher.class_teacher_of) : null,
      created_by: req.user.id
    });

    return res.status(201).json(created);
  } catch (error) {
    console.error("createQuizLink error:", error);
    return res.status(500).json({ message: "Failed to create quiz link" });
  }
};

exports.getQuizLinks = async (req, res) => {
  try {
    if (Number(req.user.role_id) === 4) {
      const teacher = await Teacher.findOne({ where: { user_id: req.user.id } });
      if (!teacher) return res.json([]);

      const quizLinks = await QuizLink.findAll({
        where: teacher.class_teacher_of
          ? {
              [Op.or]: [
                { class_id: Number(teacher.class_teacher_of) },
                { created_by: req.user.id }
              ]
            }
          : { created_by: req.user.id },
        order: [["created_at", "DESC"]]
      });
      return res.json(quizLinks);
    }

    if (Number(req.user.role_id) === 2) {
      const student = await Student.findOne({ where: { user_id: req.user.id } });
      if (!student || !student.class_id) return res.json([]);

      const quizLinks = await QuizLink.findAll({
        where: {
          [Op.or]: [{ class_id: Number(student.class_id) }, { class_id: null }]
        },
        order: [["created_at", "DESC"]]
      });
      return res.json(quizLinks);
    }

    return res.status(403).json({ message: "Access denied" });
  } catch (error) {
    console.error("getQuizLinks error:", error);
    return res.status(500).json({ message: "Failed to load quiz links" });
  }
};
