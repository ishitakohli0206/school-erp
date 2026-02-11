const { Op } = require("sequelize");
const {
  User,
  Parent,
  Teacher,
  Student,
  Class,
  AdmissionEnquiry,
  ExamConfig,
  Payroll,
  ParentStudent
} = require("../models");

const ensureAdmin = (req, res) => {
  if (Number(req.user.role_id) !== 1) {
    res.status(403).json({ message: "Admin access required" });
    return false;
  }
  return true;
};

exports.getRolePermissions = async (req, res) => {
  if (!ensureAdmin(req, res)) return;

  res.json({
    admin: ["all"],
    teacher: ["attendance", "assignments", "results", "parent_updates", "subjects_view"],
    student: ["attendance_view", "results_view", "assignments_view", "fees_view", "profile_view"],
    parent: ["children_view", "attendance_view", "results_view", "fees_view", "notices_view", "notifications_view"]
  });
};

exports.getTeachers = async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) return;

    const teachers = await Teacher.findAll({
      include: [{ model: User, attributes: ["id", "name", "email"] }],
      order: [["id", "ASC"]]
    });
    return res.json(teachers);
  } catch (error) {
    console.error("getTeachers error:", error);
    return res.status(500).json({ message: "Failed to load teachers" });
  }
};

exports.getParents = async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) return;

    const parents = await Parent.findAll({
      include: [{ model: User, attributes: ["id", "name", "email"] }],
      order: [["id", "ASC"]]
    });
    return res.json(parents);
  } catch (error) {
    console.error("getParents error:", error);
    return res.status(500).json({ message: "Failed to load parents" });
  }
};

exports.getStudents = async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) return;

    const students = await Student.findAll({
      include: [
        { model: User, attributes: ["id", "name", "email"] },
        { model: Class, attributes: ["id", "class_name", "section"] }
      ],
      order: [["id", "ASC"]]
    });

    return res.json(students);
  } catch (error) {
    console.error("getStudents error:", error);
    return res.status(500).json({ message: "Failed to load students" });
  }
};

exports.getAdmissionEnquiries = async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) return;

    const rows = await AdmissionEnquiry.findAll({
      order: [["created_at", "DESC"]]
    });
    return res.json(rows);
  } catch (error) {
    console.error("getAdmissionEnquiries error:", error);
    return res.status(500).json({ message: "Failed to load admission enquiries" });
  }
};

exports.createExamConfig = async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) return;

    const { exam_name, class_id, start_date, end_date, grading_policy } = req.body;
    if (!exam_name || !class_id || !start_date || !end_date) {
      return res.status(400).json({
        message: "exam_name, class_id, start_date and end_date are required"
      });
    }

    const examConfig = await ExamConfig.create({
      exam_name,
      class_id,
      start_date,
      end_date,
      grading_policy: grading_policy || null,
      created_by: req.user.id
    });

    return res.status(201).json(examConfig);
  } catch (error) {
    console.error("createExamConfig error:", error);
    return res.status(500).json({ message: "Failed to create exam configuration" });
  }
};

exports.getExamConfigs = async (req, res) => {
  try {
    const roleId = Number(req.user.role_id);
    if (![1, 4, 2, 3].includes(roleId)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const rows = await ExamConfig.findAll({
      include: [{ model: Class, attributes: ["id", "class_name", "section"] }],
      order: [["start_date", "DESC"]]
    });
    return res.json(rows);
  } catch (error) {
    console.error("getExamConfigs error:", error);
    return res.status(500).json({ message: "Failed to load exam configurations" });
  }
};

exports.createPayroll = async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) return;

    const { teacher_id, month, base_salary, deductions = 0, bonus = 0, status = "processed", paid_on = null } = req.body;
    if (!teacher_id || !month || base_salary == null) {
      return res.status(400).json({ message: "teacher_id, month and base_salary are required" });
    }

    const netSalary = Number(base_salary) - Number(deductions) + Number(bonus);
    const [row] = await Payroll.findOrCreate({
      where: { teacher_id, month },
      defaults: {
        teacher_id,
        month,
        base_salary,
        deductions,
        bonus,
        net_salary: netSalary,
        status,
        paid_on,
        processed_by: req.user.id
      }
    });

    row.base_salary = base_salary;
    row.deductions = deductions;
    row.bonus = bonus;
    row.net_salary = netSalary;
    row.status = status;
    row.paid_on = paid_on;
    row.processed_by = req.user.id;
    await row.save();

    return res.status(201).json(row);
  } catch (error) {
    console.error("createPayroll error:", error);
    return res.status(500).json({ message: "Failed to save payroll record" });
  }
};

exports.getPayroll = async (req, res) => {
  try {
    const roleId = Number(req.user.role_id);
    if (![1, 4].includes(roleId)) {
      return res.status(403).json({ message: "Access denied" });
    }

    let where = {};
    if (roleId === 4) {
      const teacher = await Teacher.findOne({ where: { user_id: req.user.id } });
      if (!teacher) return res.json([]);
      where = { teacher_id: teacher.id };
    }

    const rows = await Payroll.findAll({
      where,
      include: [
        {
          model: Teacher,
          attributes: ["id", "name", "email"]
        }
      ],
      order: [["created_at", "DESC"]]
    });

    return res.json(rows);
  } catch (error) {
    console.error("getPayroll error:", error);
    return res.status(500).json({ message: "Failed to load payroll records" });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) return;

    const now = new Date();
    const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    const [newEnquiries, processedPayroll] = await Promise.all([
      AdmissionEnquiry.count({ where: { status: "new" } }),
      Payroll.count({
        where: {
          month: { [Op.like]: `${monthPrefix}%` },
          status: { [Op.in]: ["processed", "paid"] }
        }
      })
    ]);

    return res.json({
      newEnquiries,
      processedPayrollThisMonth: processedPayroll
    });
  } catch (error) {
    console.error("getAnalytics error:", error);
    return res.status(500).json({ message: "Failed to load analytics" });
  }
};

exports.promoteStudent = async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) return;

    const { student_id, new_class_id } = req.body;
    if (!student_id || !new_class_id) {
      return res.status(400).json({ message: "student_id and new_class_id are required" });
    }

    const [student, targetClass] = await Promise.all([
      Student.findByPk(student_id),
      Class.findByPk(new_class_id)
    ]);

    if (!student) return res.status(404).json({ message: "Student not found" });
    if (!targetClass) return res.status(404).json({ message: "Target class not found" });

    student.class_id = Number(new_class_id);
    await student.save();

    return res.json({
      message: "Student promoted successfully",
      student_id: student.id,
      new_class_id: student.class_id
    });
  } catch (error) {
    console.error("promoteStudent error:", error);
    return res.status(500).json({ message: "Failed to promote student" });
  }
};

exports.linkParentStudent = async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) return;

    const { parent_id, student_id } = req.body;
    if (!parent_id || !student_id) {
      return res.status(400).json({ message: "parent_id and student_id are required" });
    }

    const [parent, student] = await Promise.all([
      Parent.findByPk(parent_id),
      Student.findByPk(student_id)
    ]);

    if (!parent) return res.status(404).json({ message: "Parent not found" });
    if (!student) return res.status(404).json({ message: "Student not found" });

    await ParentStudent.findOrCreate({
      where: {
        parent_id: Number(parent_id),
        student_id: Number(student_id)
      },
      defaults: {
        parent_id: Number(parent_id),
        student_id: Number(student_id)
      }
    });

    if (Object.prototype.hasOwnProperty.call(parent.dataValues, "student_id") && !parent.student_id) {
      parent.student_id = Number(student_id);
      await parent.save();
    }

    return res.status(201).json({ message: "Parent linked to student successfully" });
  } catch (error) {
    console.error("linkParentStudent error:", error);
    return res.status(500).json({ message: "Failed to link parent and student" });
  }
};
