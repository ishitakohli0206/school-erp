const db = require("../models");
const Student = db.Student;
const User = db.User;
const Class = db.Class;


exports.addStudent = async (req, res) => {
  try {
    const { user_id, class_id } = req.body;

    if (!user_id || !class_id) {
      return res.status(400).json({
        message: "user_id and class_id are required"
      });
    }

    
    const user = await User.findByPk(user_id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    
    if (user.role_id !== 2) {
      return res.status(403).json({
        message: "Only students can be added to students table"
      });
    }

    const exists = await Student.findOne({
      where: { user_id, class_id }
    });

    if (exists) {
      return res.status(409).json({
        message: "Student already exists in this class"
      });
    }

    const student = await Student.create({
      user_id,
      class_id
    });

    res.status(201).json({
      message: "Student added successfully",
      student
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error adding student"
    });
  }
};


exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"]
        },
        {
          model: Class,
          attributes: ["id", "class_name"]
        }
      ]
    });

    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching students"
    });
  }
};
exports.getStudentsByClass = async (req, res) => {
  try {
    const { classId } = req.params;

    const students = await Student.findAll({
      where: { class_id: classId },
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"]
        }
      ]
    });

    res.json(students);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching students by class"
    });
  }
};
exports.getStudentsDetailed = async (req, res) => {
  try {
    const students = await Student.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"]
        },
        {
          model: Class,
          attributes: ["id", "class_name", "section"]
        }
      ]
    });

    res.json(students);
  } catch (error) {
    console.error("DETAILED STUDENT ERROR:", error);
    res.status(500).json({
      message: "Error fetching students"
    });
  }
};