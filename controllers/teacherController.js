

const { Teacher, Class } = require("../models");

exports.getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id;

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