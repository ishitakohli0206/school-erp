

const { Teacher, Class } = require("../models");

exports.getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id;
       if (req.user.role_id !== 4) {
      return res.status(403).json({ message: "Access denied" });
    }
    const teacher = await Teacher.findOne({
      where: { user_id: userId }
    });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    let classData = null;
    if (teacher.class_teacher_of) {
      classData = await Class.findByPk(teacher.class_teacher_of, {
        attributes: ["id", "class_name", "section"]
      });
    }

    res.json({
      teacher: {
        name: teacher.name,
        subject: teacher.subject
      },
      class: classData
    });

  } catch (err) {
    console.error("Teacher dashboard error", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getTeacherClasses = async (req, res) => {
  try {
    const classes = await Class.findAll({
      where: { teacher_id: req.user.id }
    });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch classes" });
  }
};

exports.getMyStudents = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({
      where: { user_id: req.user.id },
    });

    const students = await Student.findAll({
      where: { class_id: teacher.class_teacher_of },
      include: [{ model: User, attributes: ["name"] }],
    });

    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({
      where: { user_id: req.user.id },
    });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json(teacher);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};