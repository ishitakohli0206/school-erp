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
