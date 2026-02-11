const { Result, Subject, Student, User, Teacher, Class } = require("../models");
const { getLinkedStudentIds } = require("./helpers/parentHelpers");
const { Op } = require("sequelize");

exports.upsertResult = async (req, res) => {
  try {
    const roleId = Number(req.user.role_id);
    if (![1, 4].includes(roleId)) {
      return res.status(403).json({ message: "Only admin/teacher can enter marks" });
    }

    const { student_id, subject_id, exam_name, max_marks, obtained_marks, exam_date } = req.body;
    if (!student_id || !subject_id || !exam_name || obtained_marks == null || !exam_date) {
      return res.status(400).json({
        message: "student_id, subject_id, exam_name, obtained_marks and exam_date are required"
      });
    }

    const [result] = await Result.findOrCreate({
      where: {
        student_id,
        subject_id,
        exam_name,
        exam_date
      },
      defaults: {
        student_id,
        subject_id,
        exam_name,
        max_marks: max_marks || 100,
        obtained_marks,
        exam_date,
        entered_by: req.user.id
      }
    });

    if (result.entered_by !== req.user.id || result.obtained_marks !== Number(obtained_marks)) {
      result.max_marks = max_marks || result.max_marks || 100;
      result.obtained_marks = Number(obtained_marks);
      result.entered_by = req.user.id;
      await result.save();
    }

    return res.status(201).json(result);
  } catch (error) {
    console.error("upsertResult error:", error);
    return res.status(500).json({ message: "Failed to save result" });
  }
};

exports.getResultsForCurrentUser = async (req, res) => {
  try {
    const roleId = Number(req.user.role_id);

    if (roleId === 1) {
      const results = await Result.findAll({
        include: [
          {
            model: Student,
            attributes: ["id", "class_id"],
            include: [{ model: User, attributes: ["name"] }, { model: Class, attributes: ["class_name", "section"] }]
          },
          { model: Subject, attributes: ["id", "name"] }
        ],
        order: [["exam_date", "DESC"]]
      });
      return res.json(results);
    }

    if (roleId === 4) {
      const teacher = await Teacher.findOne({ where: { user_id: req.user.id } });
      if (!teacher || !teacher.class_teacher_of) return res.json([]);

      const students = await Student.findAll({
        where: { class_id: teacher.class_teacher_of },
        attributes: ["id"]
      });
      const studentIds = students.map((s) => s.id);
      if (!studentIds.length) return res.json([]);

      const results = await Result.findAll({
        where: { student_id: { [Op.in]: studentIds } },
        include: [
          {
            model: Student,
            attributes: ["id", "class_id"],
            include: [{ model: User, attributes: ["name"] }]
          },
          { model: Subject, attributes: ["id", "name"] }
        ],
        order: [["exam_date", "DESC"]]
      });
      return res.json(results);
    }

    if (roleId === 2) {
      const student = await Student.findOne({ where: { user_id: req.user.id } });
      if (!student) return res.json([]);

      const results = await Result.findAll({
        where: { student_id: student.id },
        include: [{ model: Subject, attributes: ["id", "name"] }],
        order: [["exam_date", "DESC"]]
      });
      return res.json(results);
    }

    if (roleId === 3) {
      const studentIds = await getLinkedStudentIds(req.user.id);
      if (!studentIds.length) return res.json([]);

      const results = await Result.findAll({
        where: { student_id: { [Op.in]: studentIds } },
        include: [
          {
            model: Student,
            attributes: ["id", "class_id"],
            include: [{ model: User, attributes: ["name"] }, { model: Class, attributes: ["class_name", "section"] }]
          },
          { model: Subject, attributes: ["id", "name"] }
        ],
        order: [["exam_date", "DESC"]]
      });

      return res.json(results);
    }

    return res.status(400).json({ message: "Unsupported role" });
  } catch (error) {
    console.error("getResultsForCurrentUser error:", error);
    return res.status(500).json({ message: "Failed to load results" });
  }
};
