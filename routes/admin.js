const express = require('express');
const router = express.Router();
const { Student, Parent, Class } = require('../models');
const verifyToken = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware');


router.get('/parent/:id/students', verifyToken, isAdmin, async (req, res) => {
  try {
    const parent = await Parent.findByPk(req.params.id, {
      include: Student
    });

    if (!parent) {
      return res.status(404).json({ error: 'Parent not found' });
    }

    res.json(parent.Students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/student/:id/parents', verifyToken, isAdmin, async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      include: Parent
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(student.Parents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/class/:id/students', verifyToken, isAdmin, async (req, res) => {
  try {
    const students = await Student.findAll({
      where: { class_id: req.params.id }
    });

    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/student/:id/class', verifyToken, isAdmin, async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      include: Class
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(student.Class);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
