const db = require("../models");
const Parent = db.Parent;
const Student = db.Student;
const Attendance = db.Attendance;
const User = db.User;

// =====================
// GET PARENT DASHBOARD
// =====================
exports.getParentDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const qi = db.sequelize.getQueryInterface();
    const parentTableDesc = await qi.describeTable('parents');

    let studentId;

    if (parentTableDesc && parentTableDesc.student_id) {
      const QueryTypes = db.Sequelize.QueryTypes;
      const rows = await db.sequelize.query(
        'SELECT student_id FROM parents WHERE user_id = ? LIMIT 1',
        { replacements: [userId], type: QueryTypes.SELECT }
      );
      if (!rows || rows.length === 0) return res.status(404).json({ message: "Parent not found" });
      if (!rows[0].student_id) return res.status(404).json({ message: "Child not linked" });
      studentId = rows[0].student_id;
    } else {
      const QueryTypes = db.Sequelize.QueryTypes;
      const parentRows = await db.sequelize.query(
        'SELECT id FROM parents WHERE user_id = ? LIMIT 1',
        { replacements: [userId], type: QueryTypes.SELECT }
      );
      if (!parentRows || parentRows.length === 0) return res.status(404).json({ message: "Parent not found" });
      const parentId = parentRows[0].id;
      const link = await db.ParentStudent.findOne({ where: { parent_id: parentId } });
      if (!link) return res.status(404).json({ message: "Child not linked" });
      studentId = link.student_id;
    }

    const student = await Student.findByPk(studentId, {
      include: {
        model: User,
        attributes: ["name"]
      }
    });

    if (!student) {
      return res.status(404).json({ message: "Child not found" });
    }

    res.json({
      student_id: student.id,
      student_name: student.User.name,
      class_id: student.class_id
    });

  } catch (err) {
    console.error("getParentDashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// =====================
// GET CHILD (LOGIN USE)
// =====================
exports.getMyChild = async (req, res) => {
  try {
    const userId = req.user.id;

    const qi = db.sequelize.getQueryInterface();
    const parentTableDesc = await qi.describeTable('parents');

    let studentId;

    if (parentTableDesc && parentTableDesc.student_id) {
      const QueryTypes = db.Sequelize.QueryTypes;
      const rows = await db.sequelize.query(
        'SELECT student_id FROM parents WHERE user_id = ? LIMIT 1',
        { replacements: [userId], type: QueryTypes.SELECT }
      );
      if (!rows || rows.length === 0) return res.status(404).json({ message: "Parent not found" });
      if (!rows[0].student_id) return res.status(404).json({ message: "Child not linked" });
      studentId = rows[0].student_id;
    } else {
      const QueryTypes = db.Sequelize.QueryTypes;
      const parentRows = await db.sequelize.query(
        'SELECT id FROM parents WHERE user_id = ? LIMIT 1',
        { replacements: [userId], type: QueryTypes.SELECT }
      );
      if (!parentRows || parentRows.length === 0) return res.status(404).json({ message: "Parent not found" });
      const parentId = parentRows[0].id;
      const link = await db.ParentStudent.findOne({ where: { parent_id: parentId } });
      if (!link) return res.status(404).json({ message: "Child not linked" });
      studentId = link.student_id;
    }

    const student = await Student.findByPk(studentId, {
      include: {
        model: User,
        attributes: ["name"]
      }
    });

    if (!student) {
      return res.status(404).json({ message: "Child not found" });
    }

    res.json({
      student_id: student.id,
      student_name: student.User.name,
      class_id: student.class_id
    });

  } catch (err) {
    console.error("getMyChild error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =====================
// GET CHILD ATTENDANCE
// =====================
exports.getChildAttendance = async (req, res) => {
  try {
    const userId = req.user.id;

    const qi = db.sequelize.getQueryInterface();
    const parentTableDesc = await qi.describeTable('parents');

    let studentId;

    if (parentTableDesc && parentTableDesc.student_id) {
      const QueryTypes = db.Sequelize.QueryTypes;
      const rows = await db.sequelize.query(
        'SELECT student_id FROM parents WHERE user_id = ? LIMIT 1',
        { replacements: [userId], type: QueryTypes.SELECT }
      );
      if (!rows || rows.length === 0) return res.status(404).json({ message: "Parent not found" });
      if (!rows[0].student_id) return res.status(404).json({ message: "Child not linked to parent" });
      studentId = rows[0].student_id;
    } else {
      const QueryTypes = db.Sequelize.QueryTypes;
      const parentRows = await db.sequelize.query(
        'SELECT id FROM parents WHERE user_id = ? LIMIT 1',
        { replacements: [userId], type: QueryTypes.SELECT }
      );
      if (!parentRows || parentRows.length === 0) return res.status(404).json({ message: "Parent not found" });
      const parentId = parentRows[0].id;
      const link = await db.ParentStudent.findOne({ where: { parent_id: parentId } });
      if (!link) return res.status(404).json({ message: "Child not linked to parent" });
      studentId = link.student_id;
    }

    const attendance = await Attendance.findAll({ where: { student_id: studentId }, order: [["date", "DESC"]] });
    res.json(attendance);

  } catch (err) {
    console.error("Attendance error:", err);
    res.status(500).json({
      message: "Unable to fetch attendance",
      error: err.message
    });
  }
};
