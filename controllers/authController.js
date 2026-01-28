const User = require("../models").User;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role_id } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role_id
    });

    res.status(201).json({ message: "Registered successfully" });

  } catch (error) {
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

    const token = jwt.sign(
      { id: user.id, role_id: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    let role = null;

    if (Number(user.role_id) === 1) role = "admin";
    if (Number(user.role_id) === 2) role = "student";

    if (!role) {
      return res.status(400).json({ message: "Role missing or invalid" });
    }

    const response = {
      message: "Login successful",
      token,
      role,
      user_id: user.id
    };

    // If student, fetch and include student_id
    if (role === "student") {
      try {
        const Student = require("../models").Student;
        const student = await Student.findOne({ where: { user_id: user.id } });
        
        console.log("[LOGIN] Student lookup - user_id:", user.id);
        console.log("[LOGIN] Student found:", student?.dataValues);
        
        if (student) {
          response.student_id = student.id;
          console.log("[LOGIN] student_id set to:", student.id);
        } else {
          console.warn("[LOGIN] No student record found for user_id:", user.id);
        }
      } catch (studentError) {
        console.error("[LOGIN] Error fetching student record:", studentError.message);
      }
    }

    return res.json(response);
  } catch (error) {
    console.error("[LOGIN] Unexpected error:", error);
    return res.status(500).json({ message: "Server error during login" });
  }
};
