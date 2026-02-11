const { Assignment, Subject, Class, Teacher, Student, User } = require("../models");
const { getLinkedStudentIds } = require("./helpers/parentHelpers");
const { Op } = require("sequelize");

exports.createAssignment = async (req, res) => {
  try {
    const roleId = Number(req.user.role_id);
    if (![1, 4].includes(roleId)) {
      return res.status(403).json({ message: "Only admin/teacher can create assignments" });
    }

    const { title, description, due_date, class_id, subject_id } = req.body;
    if (!title || !due_date || !class_id) {
      return res.status(400).json({ message: "title, due_date and class_id are required" });
    }

    const assignment = await Assignment.create({
      title,
      description: description || null,
      due_date,
      class_id,
      subject_id: subject_id || null,
      created_by: req.user.id
    });

    return res.status(201).json(assignment);
  } catch (error) {
    console.error("createAssignment error:", error);
    return res.status(500).json({ message: "Failed to create assignment" });
  }
};

exports.getAssignmentsForCurrentUser = async (req, res) => {
  try {
    const roleId = Number(req.user.role_id);

    // Admin: all assignments
    if (roleId === 1) {
      const assignments = await Assignment.findAll({
        include: [
          { model: Class, attributes: ["id", "class_name", "section"] },
          { model: Subject, attributes: ["id", "name"] }
        ],
        order: [["due_date", "ASC"]]
      });
      return res.json(assignments);
    }

    // Teacher: assignments of assigned class
    if (roleId === 4) {
      const teacher = await Teacher.findOne({ where: { user_id: req.user.id } });
      if (!teacher || !teacher.class_teacher_of) return res.json([]);

      const assignments = await Assignment.findAll({
        where: { class_id: teacher.class_teacher_of },
        include: [
          { model: Class, attributes: ["id", "class_name", "section"] },
          { model: Subject, attributes: ["id", "name"] }
        ],
        order: [["due_date", "ASC"]]
      });

      return res.json(assignments);
    }

    // Student: assignments by class
    if (roleId === 2) {
      const student = await Student.findOne({ where: { user_id: req.user.id } });
      if (!student) return res.json([]);

      const assignments = await Assignment.findAll({
        where: { class_id: student.class_id },
        include: [
          { model: Class, attributes: ["id", "class_name", "section"] },
          { model: Subject, attributes: ["id", "name"] }
        ],
        order: [["due_date", "ASC"]]
      });

      return res.json(assignments);
    }

    // Parent: assignments of all linked children
    if (roleId === 3) {
      const studentIds = await getLinkedStudentIds(req.user.id);
      if (!studentIds.length) return res.json([]);

      const children = await Student.findAll({
        where: { id: { [Op.in]: studentIds } },
        attributes: ["id", "class_id"],
        include: [{ model: User, attributes: ["name"] }]
      });

      const classIds = [...new Set(children.map((child) => child.class_id))];
      if (!classIds.length) return res.json([]);

      const assignments = await Assignment.findAll({
        where: { class_id: { [Op.in]: classIds } },
        include: [
          { model: Class, attributes: ["id", "class_name", "section"] },
          { model: Subject, attributes: ["id", "name"] }
        ],
        order: [["due_date", "ASC"]]
      });

      return res.json({
        children: children.map((c) => ({
          student_id: c.id,
          student_name: c.User?.name || null,
          class_id: c.class_id
        })),
        assignments
      });
    }

    return res.status(400).json({ message: "Unsupported role" });
  } catch (error) {
    console.error("getAssignmentsForCurrentUser error:", error);
    return res.status(500).json({ message: "Failed to load assignments" });
  }
};
