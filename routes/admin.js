const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

const Classes = require("../models/classes")(
  require("../config/db"),
  require("sequelize")
);

// safety check (temporary)
console.log("Classes model:", Classes);


// CREATE class
router.post("/class", verifyToken, isAdmin, async (req, res) => {
  try {
    const { class_name, section } = req.body;

    const newClass = await Classes.create({
      class_name,
      section
    });

    res.status(201).json(newClass);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all classes
router.get("/classes", verifyToken, isAdmin, async (req, res) => {
  try {
    const classes = await Classes.findAll();
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
