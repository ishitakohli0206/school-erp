const { Student, Teacher, Class, Assignment, Result, Fee, Notice, Attendance } = require("../models");
const { Op } = require("sequelize");

exports.getAdminOverview = async (req, res) => {
  try {
    if (Number(req.user.role_id) !== 1) {
      return res.status(403).json({ message: "Access denied" });
    }

    const today = new Date().toISOString().split("T")[0];

    const [
      totalStudents,
      totalTeachers,
      totalClasses,
      totalAssignments,
      totalResults,
      totalNotices,
      presentToday,
      absentToday,
      feeSummary
    ] = await Promise.all([
      Student.count(),
      Teacher.count(),
      Class.count(),
      Assignment.count(),
      Result.count(),
      Notice.count(),
      Attendance.count({ where: { date: today, status: "present" } }),
      Attendance.count({ where: { date: today, status: "absent" } }),
      Fee.findAll({
        attributes: ["status"],
        where: { status: { [Op.in]: ["pending", "partial", "overdue"] } }
      })
    ]);

    res.json({
      totalStudents,
      totalTeachers,
      totalClasses,
      totalAssignments,
      totalResults,
      totalNotices,
      presentToday,
      absentToday,
      pendingFees: feeSummary.length
    });
  } catch (error) {
    console.error("getAdminOverview error:", error);
    res.status(500).json({ message: "Failed to load ERP dashboard overview" });
  }
};
