const db = require("../models");
const Attendance = db.Attendance;
const Student = db.Student;

//mark or update
exports.markAttendance = async (req, res) => {
  try {
    const { student_id, date, status } = req.body;

    if (!student_id || !date || !status) {
      return res.status(400).json({
        message: "student_id, date and status are required"
      });
    }


   
    const existing = await Attendance.findOne({
      where: { student_id, date }
    });
    const studentExists = await Student.findByPk(student_id);
     if (!studentExists) {
     return res.status(404).json({ message: "Student not found" });
}
    if (existing) {
      existing.status = status;
      await existing.save();

      return res.json({
        message: "Attendance updated successfully"
      });
    }

    await Attendance.create({
      student_id,
      date,
      status
    });

    res.status(201).json({
      message: "Attendance marked successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//student
exports.getStudentAttendance = async (req, res) => {
  try {
    const { student_id } = req.params;

    console.log("getStudentAttendance called with student_id:", student_id);

    if (!student_id) {
      return res.status(400).json({
        message: "student_id is required"
      });
    }

    const attendance = await Attendance.findAll({
      where: { student_id },
      order: [["date", "DESC"]]
    });

    console.log("Attendance records found:", attendance.length);

    res.json(attendance);

  } catch (error) {
    console.error("Error fetching student attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//class
exports.getClassAttendance = async (req, res) => {
  try {
    const { class_id, date } = req.query;

    if (!class_id || !date) {
      return res.status(400).json({
        message: "class_id and date are required"
      });
    }

    const attendance = await Attendance.findAll({
      where: { date },
      include: [
        {
          model: Student,
          where: { class_id },
          attributes: ["id", "class_id"]
        }
      ]
    });

    res.json(attendance);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
