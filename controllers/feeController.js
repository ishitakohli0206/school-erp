const { Fee, Student, User, Class, FeePayment } = require("../models");
const { getLinkedStudentIds } = require("./helpers/parentHelpers");
const { Op } = require("sequelize");

const computeStatus = (due, paid, dueDate) => {
  const dueNum = Number(due);
  const paidNum = Number(paid);
  if (paidNum >= dueNum) return "paid";
  if (paidNum > 0) return "partial";
  if (new Date(dueDate) < new Date()) return "overdue";
  return "pending";
};

exports.createOrUpdateFee = async (req, res) => {
  try {
    if (Number(req.user.role_id) !== 1) {
      return res.status(403).json({ message: "Only admin can manage fees" });
    }

    const { student_id, term, amount_due, amount_paid = 0, due_date, last_payment_date = null } = req.body;
    if (!student_id || !term || amount_due == null || !due_date) {
      return res.status(400).json({ message: "student_id, term, amount_due and due_date are required" });
    }

    const status = computeStatus(amount_due, amount_paid, due_date);

    const [fee, created] = await Fee.findOrCreate({
      where: { student_id, term },
      defaults: {
        student_id,
        term,
        amount_due,
        amount_paid,
        due_date,
        status,
        last_payment_date
      }
    });

    // Track previous paid amount so we can create a FeePayment record for any increase
    const previousPaid = created ? 0 : Number(fee.amount_paid || 0);

    fee.amount_due = amount_due;
    fee.amount_paid = amount_paid;
    fee.due_date = due_date;
    fee.last_payment_date = last_payment_date;
    fee.status = status;
    await fee.save();

    // If admin (or caller) updated amount_paid to a higher value, create a FeePayment entry
    const delta = Number(amount_paid) - previousPaid;
    if (delta > 0) {
      try {
        await FeePayment.create({
          fee_id: fee.id,
          student_id: fee.student_id,
          amount: delta,
          payment_method: req.body.payment_method || "manual",
          reference_no: `RCPT-${Date.now()}`,
          paid_on: last_payment_date || new Date().toISOString().split("T")[0],
          received_by: req.user.id
        });
      } catch (err) {
        console.error("Failed to create FeePayment for manual update:", err);
      }
    }

    return res.status(201).json(fee);
  } catch (error) {
    console.error("createOrUpdateFee error:", error);
    return res.status(500).json({ message: "Failed to save fee data" });
  }
};

exports.getFeesForCurrentUser = async (req, res) => {
  try {
    const roleId = Number(req.user.role_id);

    if (roleId === 1) {
      const fees = await Fee.findAll({
        include: [
          {
            model: Student,
            include: [{ model: User, attributes: ["name"] }, { model: Class, attributes: ["class_name", "section"] }]
          }
        ],
        order: [["due_date", "DESC"]]
      });
      return res.json(fees);
    }

    if (roleId === 2) {
      const student = await Student.findOne({ where: { user_id: req.user.id } });
      if (!student) return res.json([]);

      const fees = await Fee.findAll({
        where: { student_id: student.id },
        order: [["due_date", "DESC"]]
      });
      return res.json(fees);
    }

    if (roleId === 3) {
      const studentIds = await getLinkedStudentIds(req.user.id);
      if (!studentIds.length) return res.json([]);

      const fees = await Fee.findAll({
        where: { student_id: { [Op.in]: studentIds } },
        include: [
          {
            model: Student,
            include: [{ model: User, attributes: ["name"] }, { model: Class, attributes: ["class_name", "section"] }]
          }
        ],
        order: [["due_date", "DESC"]]
      });
      return res.json(fees);
    }

    return res.status(400).json({ message: "Unsupported role" });
  } catch (error) {
    console.error("getFeesForCurrentUser error:", error);
    return res.status(500).json({ message: "Failed to load fee data" });
  }
};

exports.getFeeSummary = async (req, res) => {
  try {
    if (Number(req.user.role_id) !== 1) {
      return res.status(403).json({ message: "Access denied" });
    }

    const totalRecords = await Fee.count();
    const totalDue = await Fee.sum("amount_due");
    const totalPaid = await Fee.sum("amount_paid");
    const pending = await Fee.count({ where: { status: { [Op.in]: ["pending", "partial", "overdue"] } } });

    return res.json({
      totalRecords,
      totalDue: Number(totalDue || 0),
      totalPaid: Number(totalPaid || 0),
      pending
    });
  } catch (error) {
    console.error("getFeeSummary error:", error);
    return res.status(500).json({ message: "Failed to load fee summary" });
  }
};

exports.payFee = async (req, res) => {
  try {
    const roleId = Number(req.user.role_id);
    if (![1, 2, 3].includes(roleId)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { fee_id, amount, payment_method = "online" } = req.body;
    if (!fee_id || amount == null) {
      return res.status(400).json({ message: "fee_id and amount are required" });
    }

    const fee = await Fee.findByPk(fee_id);
    if (!fee) {
      return res.status(404).json({ message: "Fee record not found" });
    }

    if (roleId === 2) {
      const student = await Student.findOne({ where: { user_id: req.user.id } });
      if (!student || student.id !== fee.student_id) {
        return res.status(403).json({ message: "Fee record does not belong to this student" });
      }
    }

    if (roleId === 3) {
      const studentIds = await getLinkedStudentIds(req.user.id);
      if (!studentIds.includes(fee.student_id)) {
        return res.status(403).json({ message: "Access denied for selected fee record" });
      }
    }

    const newPaid = Number(fee.amount_paid) + Number(amount);
    fee.amount_paid = newPaid;
    fee.last_payment_date = new Date().toISOString().split("T")[0];
    fee.status = computeStatus(fee.amount_due, newPaid, fee.due_date);
    await fee.save();

    const payment = await FeePayment.create({
      fee_id: fee.id,
      student_id: fee.student_id,
      amount: Number(amount),
      payment_method,
      reference_no: `RCPT-${Date.now()}`,
      paid_on: fee.last_payment_date,
      received_by: roleId === 1 ? req.user.id : null
    });

    return res.status(201).json({
      message: "Payment successful",
      fee,
      receipt: payment
    });
  } catch (error) {
    console.error("payFee error:", error);
    return res.status(500).json({ message: "Failed to process fee payment" });
  }
};

exports.getPaymentHistory = async (req, res) => {
  try {
    const roleId = Number(req.user.role_id);
    let where = {};

    if (roleId === 2) {
      const student = await Student.findOne({ where: { user_id: req.user.id } });
      if (!student) return res.json([]);
      where = { student_id: student.id };
    } else if (roleId === 3) {
      const studentIds = await getLinkedStudentIds(req.user.id);
      if (!studentIds.length) return res.json([]);
      where = { student_id: { [Op.in]: studentIds } };
    } else if (roleId !== 1) {
      return res.status(403).json({ message: "Access denied" });
    }

    const rows = await FeePayment.findAll({
      where,
      include: [
        {
          model: Student,
          include: [{ model: User, attributes: ["name"] }, { model: Class, attributes: ["class_name", "section"] }]
        },
        {
          model: Fee,
          attributes: ["term", "amount_due", "amount_paid", "status"]
        }
      ],
      order: [["created_at", "DESC"]]
    });

    // If there are no FeePayment rows for the requested students, but Fee rows show amount_paid,
    // surface those as legacy/manual payments so payment history is visible.
    let resultRows = rows.slice();

    // Only attempt to synthesize legacy payments when none (or few) real payments exist
    if (resultRows.length === 0) {
      // fetch fees for the same students
      const fees = await Fee.findAll({
        where,
        include: [
          {
            model: Student,
            include: [{ model: User, attributes: ["name"] }, { model: Class, attributes: ["class_name", "section"] }]
          }
        ]
      });

      for (const f of fees) {
        const paid = Number(f.amount_paid || 0);
        if (paid > 0) {
          resultRows.push({
            id: `legacy-fee-${f.id}`,
            reference_no: `LEGACY-${f.id}`,
            amount: paid,
            payment_method: "manual",
            paid_on: f.last_payment_date || f.due_date || null,
            Student: f.Student,
            Fee: f
          });
        }
      }
    }

    return res.json(resultRows);
  } catch (error) {
    console.error("getPaymentHistory error:", error);
    return res.status(500).json({ message: "Failed to load payment history" });
  }
};
