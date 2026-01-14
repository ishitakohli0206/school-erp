const express = require("express");
const router = express.Router();
const db = require("../models");

const { User, Student, Parent, ParentStudent } = db;


router.post("/student", async (req, res) => {
  try {
    const { user_id, class_id } = req.body;

    const student = await Student.create({
      user_id,
      class_id,
    });

    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/parent", async (req, res) => {
  try {
    const { user_id } = req.body;

    const parent = await Parent.create({ user_id });
    res.json(parent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* LINK PARENT & STUDENT */
router.post("/parent-student", async (req, res) => {
  try {
    const { parent_id, student_id } = req.body;

    const link = await ParentStudent.create({
      parent_id,
      student_id,
    });

    res.json(link);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
