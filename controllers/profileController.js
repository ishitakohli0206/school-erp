const { User, Student, Parent, Teacher, Class } = require("../models");

exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "role_id"]
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const roleId = Number(user.role_id);
    let roleProfile = null;

    if (roleId === 2) {
      roleProfile = await Student.findOne({
        where: { user_id: user.id },
        include: [{ model: Class, attributes: ["id", "class_name", "section"] }]
      });
    }

    if (roleId === 3) {
      roleProfile = await Parent.findOne({ where: { user_id: user.id }, attributes: ["id", "user_id"] });
    }

    if (roleId === 4) {
      roleProfile = await Teacher.findOne({ where: { user_id: user.id } });
    }

    return res.json({
      user,
      role_profile: roleProfile
    });
  } catch (error) {
    console.error("getMyProfile error:", error);
    return res.status(500).json({ message: "Failed to load profile" });
  }
};

exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const roleId = Number(user.role_id);
    if (roleId !== 2) {
      return res.status(403).json({ message: "Only students can upload a profile picture here" });
    }

    const student = await Student.findOne({ where: { user_id: user.id } });
    if (!student) return res.status(404).json({ message: "Student profile not found" });

    // Save the filename in the student record
    student.profile_picture = req.file.filename;
    await student.save();

    return res.json({ message: "Profile picture uploaded", filename: req.file.filename });
  } catch (error) {
    console.error("uploadProfilePicture error:", error);
    return res.status(500).json({ message: "Failed to upload profile picture" });
  }
};
