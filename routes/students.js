const express = require("express");
const router = express.Router();
const db = require("../models");

const { Student, User, Class } = db;

/**
 * CREATE STUDENT
 * POST /admin/students
 */
router.post("/", async (req, res) => {
  try {
    const { user_id, class_id } = req.body;

    if (!user_id || !class_id) {
      return res.status(400).json({
        error: "user_id and class_id are required",
      });
    }

    const student = await Student.create({
      user_id,
      class_id,
    });

    res.status(201).json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET ALL STUDENTS
 * GET /admin/students
 */
router.get("/", async (req, res) => {
  try {
    const students = await Student.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"],
        },
        {
          model: Class,
          attributes: ["id", "class_name", "section"],
        },
      ],
    });

    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET SINGLE STUDENT
 * GET /admin/students/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE STUDENT
 * DELETE /admin/students/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Student.destroy({
      where: { id: req.params.id },
    });

    if (!deleted) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
