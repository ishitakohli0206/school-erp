const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const { login } = require("../controllers/authController");
const { register } = require("../controllers/authController");


router.post("/login", (req, res) => {
  const { email } = req.body;

  let role = "student";

  if (email === "admin@test.com") role = "admin";
  else if (email === "teacher@test.com") role = "teacher";
  else if (email === "parent@test.com") role = "parent";
  else if (email === "student@test.com") role = "student";

  res.json({
    success: true,
    token: "dummy-token",
    user: {
      email,
      role
    }
  });
});

router.post("/register", register);

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
      user.role_id === 3 ? "parent" :
      user.role_id === 4 ? "teacher" :
      null;

   
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
