const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const { login } = require("../controllers/authController");
const { register } = require("../controllers/authController");

/**
 * POST /auth/login
 * Uses authController.login
 */
router.post("/login", login);

/**
 * POST /auth/register
 * Uses authController.register
 */
router.post("/register", register);

/**
 * GET /auth/me
 * Get current user info
 */
router.get("/me", verifyToken, async (req, res) => {
  try {
    const User = require("../models").User;
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "role_id"]
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const role =
      user.role_id === 1 ? "admin" :
      user.role_id === 2 ? "student" :
      null;

    // If student, also return student_id
    let response = {
      id: user.id,
      name: user.name,
      email: user.email,
      role
    };

    if (role === "student") {
      const Student = require("../models").Student;
      const student = await Student.findOne({ where: { user_id: user.id } });
      if (student) {
        response.student_id = student.id;
      }
    }

    res.json(response);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
