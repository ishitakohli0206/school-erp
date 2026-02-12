const db = require("../models");
const { Op } = require("sequelize");
const { getLinkedStudentIds } = require("./helpers/parentHelpers");

const Student = db.Student;
const Attendance = db.Attendance;
const User = db.User;
const Class = db.Class;
const Notification = db.Notification;
const Result = db.Result;
const Subject = db.Subject;
const Fee = db.Fee;
const Assignment = db.Assignment;

const getChildrenData = async (userId) => {
  const studentIds = await getLinkedStudentIds(userId);
  if (!studentIds.length) return [];

  return Student.findAll({
    where: { id: { [Op.in]: studentIds } },
    include: [
      { model: User, attributes: ["id", "name", "email"] },
      { model: Class, attributes: ["id", "class_name", "section"] }
    ],
    order: [["id", "ASC"]]
  });
};

exports.getParentDashboard = async (req, res) => {
  try {
    const children = await getChildrenData(req.user.id);
    if (!children.length) {
      return res.status(404).json({ message: "No linked children found" });
    }

    const firstChild = children[0];
    return res.json({
      student_id: firstChild.id,
      student_name: firstChild.User?.name || null,
      class_id: firstChild.class_id,
      class_name: firstChild.Class?.class_name || null,
      children: children.map((child) => ({
        student_id: child.id,
        student_name: child.User?.name || null,
        class_id: child.class_id,
        class_name: child.Class?.class_name || null
      }))
    });
  } catch (err) {
    console.error("getParentDashboard error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getMyChild = async (req, res) => {
  try {
    const children = await getChildrenData(req.user.id);
    if (!children.length) {
      return res.status(404).json({ message: "No linked child found" });
    }

    const child = children[0];
    return res.json({
      student_id: child.id,
      student_name: child.User?.name || null,
      class_id: child.class_id,
      class_name: child.Class?.class_name || null
    });
  } catch (err) {
    console.error("getMyChild error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getMyChildren = async (req, res) => {
  try {
    const children = await getChildrenData(req.user.id);
    return res.json(
      children.map((child) => ({
        student_id: child.id,
        student_name: child.User?.name || null,
        class_id: child.class_id,
        class_name: child.Class?.class_name || null
      }))
    );
  } catch (err) {
    console.error("getMyChildren error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getChildAttendance = async (req, res) => {
  try {
    const studentIds = await getLinkedStudentIds(req.user.id);
    if (!studentIds.length) return res.status(404).json({ message: "Child not linked" });

    const requestedStudentId = req.query.student_id ? Number(req.query.student_id) : null;
    const allowedStudentIds = requestedStudentId
      ? studentIds.filter((id) => id === requestedStudentId)
      : studentIds;

    if (!allowedStudentIds.length) {
      return res.status(403).json({ message: "Access denied for this student" });
    }

    const attendance = await Attendance.findAll({
      where: { student_id: { [Op.in]: allowedStudentIds } },
      order: [["date", "DESC"]]
    });

    res.json(attendance);
  } catch (err) {
    console.error("Attendance error:", err);
    res.status(500).json({
      message: "Unable to fetch attendance",
      error: err.message
    });
  }
};

exports.getParentNotifications = async (req, res) => {
  try {
    // resolve Parent record for the logged-in user (req.user.id is the User id)
    const parent = await db.Parent.findOne({ where: { user_id: req.user.id }, attributes: ["id"] });
    if (!parent) return res.status(404).json({ message: "Parent record not found" });

    const notifications = await Notification.findAll({
      where: { parent_id: parent.id },
      order: [["id", "DESC"]]
    });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Notification error:", error);
    res.status(500).json({
      message: "Failed to fetch notifications"
    });
  }
};

exports.getParentAcademics = async (req, res) => {
  try {
    const studentIds = await getLinkedStudentIds(req.user.id);
    if (!studentIds.length) return res.json({ results: [], fees: [], assignments: [] });

    const students = await Student.findAll({
      where: { id: { [Op.in]: studentIds } },
      include: [{ model: User, attributes: ["name"] }, { model: Class, attributes: ["class_name", "section"] }]
    });

    const classIds = [...new Set(students.map((s) => s.class_id))];

    const [results, fees, assignments] = await Promise.all([
      Result.findAll({
        where: { student_id: { [Op.in]: studentIds } },
        include: [{ model: Subject, attributes: ["name"] }, { model: Student, include: [{ model: User, attributes: ["name"] }] }],
        order: [["exam_date", "DESC"]]
      }),
      Fee.findAll({
        where: { student_id: { [Op.in]: studentIds } },
        include: [{ model: Student, include: [{ model: User, attributes: ["name"] }] }],
        order: [["due_date", "DESC"]]
      }),
      Assignment.findAll({
        where: { class_id: { [Op.in]: classIds } },
        include: [{ model: Subject, attributes: ["name"] }, { model: Class, attributes: ["class_name", "section"] }],
        order: [["due_date", "ASC"]]
      })
    ]);

    res.json({
      children: students.map((s) => ({
        student_id: s.id,
        student_name: s.User?.name || null,
        class_id: s.class_id,
        class_name: s.Class?.class_name || null,
        section: s.Class?.section || null
      })),
      results,
      fees,
      assignments
    });
  } catch (error) {
    console.error("getParentAcademics error:", error);
    res.status(500).json({ message: "Failed to load parent academic data" });
  }
};
