const db = require("../models");
const User = db.User;
const Parent = db.Parent;
const Student = db.Student;
const Teacher = db.Teacher;

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


exports.register = async (req, res) => {
  try {
    const { name, email, password, role_id,phone,
      subject,
      class_teacher_of } = req.body;

    if (!name || !email || !password || !role_id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role_id
    });
     if (Number(role_id === 4)) {
      if (!Teacher) {
        return res.status(500).json({ message: "Teacher model not loaded" });
      }
      await Teacher.create({
        user_id: user.id,
        name,
        email,
        phone: phone || null,
        subject: subject || null,
        class_teacher_of: class_teacher_of || null
      });
    }
   
    if (Number(role_id) === 3) {
      await Parent.create({
        user_id: user.id
      });
    }

   
    res.status(201).json({ message: "Registered successfully" });

  } catch (error) {
    console.error("[REGISTER ERROR]", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    let role = null;
    if (user.role_id === 1) role = "admin";
    if (user.role_id === 2) role = "student";
    if (user.role_id === 3) role = "parent";
    if (user.role_id == 4) role ="teacher";

    if (!role) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const token = jwt.sign(
      { id: user.id, role_id: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const response = {
      message: "Login successful",
      token: token,
      role_id: user.role_id,
      user_id: user.id,
      name: user.name
    };

  
    if (role === "student") {
      const student = await Student.findOne({ where: { user_id: user.id } });
      if (student) response.student_id = student.id;
    }

    res.json(response);

  } catch (error) {
    console.error("[LOGIN ERROR]", error);
    res.status(500).json({ message: "Server error" });
  }
};
