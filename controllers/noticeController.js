const { Notice, Class } = require("../models");
const { Op } = require("sequelize");

const getRoleName = (roleId) => {
  if (roleId === 1) return "admin";
  if (roleId === 2) return "student";
  if (roleId === 3) return "parent";
  if (roleId === 4) return "teacher";
  return null;
};

exports.createNotice = async (req, res) => {
  try {
    if (Number(req.user.role_id) !== 1) {
      return res.status(403).json({ message: "Only admin can create notices" });
    }

    const { title, message, target_role = "all", class_id = null } = req.body;
    if (!title || !message) {
      return res.status(400).json({ message: "title and message are required" });
    }

    const notice = await Notice.create({
      title,
      message,
      target_role,
      class_id,
      created_by: req.user.id
    });

    return res.status(201).json(notice);
  } catch (error) {
    console.error("createNotice error:", error);
    return res.status(500).json({ message: "Failed to create notice" });
  }
};

exports.getNotices = async (req, res) => {
  try {
    const roleName = getRoleName(Number(req.user.role_id));
    if (!roleName) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const notices = await Notice.findAll({
      where: {
        target_role: {
          [Op.in]: ["all", roleName]
        }
      },
      include: [{ model: Class, attributes: ["id", "class_name", "section"] }],
      order: [["created_at", "DESC"]]
    });

    return res.json(notices);
  } catch (error) {
    console.error("getNotices error:", error);
    return res.status(500).json({ message: "Failed to load notices" });
  }
};

exports.getAllNoticesForAdmin = async (req, res) => {
  try {
    if (Number(req.user.role_id) !== 1) {
      return res.status(403).json({ message: "Access denied" });
    }

    const notices = await Notice.findAll({
      include: [{ model: Class, attributes: ["id", "class_name", "section"] }],
      order: [["created_at", "DESC"]]
    });

    return res.json(notices);
  } catch (error) {
    console.error("getAllNoticesForAdmin error:", error);
    return res.status(500).json({ message: "Failed to load notices" });
  }
};
