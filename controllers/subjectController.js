const { Subject, Teacher, Class } = require("../models");

exports.createSubject = async (req, res) => {
  try {
    const roleId = Number(req.user.role_id);
    if (roleId !== 1) {
      return res.status(403).json({ message: "Only admin can create subjects" });
    }

    const { name, class_id, teacher_id = null } = req.body;
    if (!name || !class_id) {
      return res.status(400).json({ message: "name and class_id are required" });
    }

    const subject = await Subject.create({
      name,
      class_id,
      teacher_id
    });

    return res.status(201).json(subject);
  } catch (error) {
    console.error("createSubject error:", error);
    return res.status(500).json({ message: "Failed to create subject" });
  }
};

exports.getSubjects = async (req, res) => {
  try {
    const roleId = Number(req.user.role_id);
    let where = {};

    if (roleId === 4) {
      const teacher = await Teacher.findOne({ where: { user_id: req.user.id } });
      if (!teacher || !teacher.class_teacher_of) return res.json([]);
      where = { class_id: teacher.class_teacher_of };
    }

    const subjects = await Subject.findAll({
      where,
      include: [
        { model: Class, attributes: ["id", "class_name", "section"] },
        { model: Teacher, attributes: ["id", "name", "subject"] }
      ]
    });

    return res.json(subjects);
  } catch (error) {
    console.error("getSubjects error:", error);
    return res.status(500).json({ message: "Failed to load subjects" });
  }
};
