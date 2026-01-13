const db = require("../models");
const Class = db.Class;

exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.findAll();
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching classes" });
  }
};

exports.createClass = async (req, res) => {
  try {
    const { class_name, section } = req.body;

    const newClass = await Class.create({
      class_name,
      section
    });

    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ message: "Error creating class" });
  }
};
