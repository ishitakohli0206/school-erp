const db = require("../../models");

const getParentRecord = async (userId) => {
  // only request columns that exist in the DB to avoid selecting removed fields
  return db.Parent.findOne({ where: { user_id: userId }, attributes: ["id", "user_id"] });
};

const getLinkedStudentIds = async (userId) => {
  const parent = await getParentRecord(userId);
  if (!parent) return [];

  const studentIds = new Set();

  const links = await db.ParentStudent.findAll({ where: { parent_id: parent.id } });

  links.forEach((link) => studentIds.add(link.student_id));
  return Array.from(studentIds);
};

module.exports = {
  getParentRecord,
  getLinkedStudentIds
};
