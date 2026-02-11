const db = require("../../models");

const getParentRecord = async (userId) => {
  return db.Parent.findOne({ where: { user_id: userId } });
};

const getLinkedStudentIds = async (userId) => {
  const parent = await getParentRecord(userId);
  if (!parent) return [];

  const studentIds = new Set();

  if (parent.student_id) {
    studentIds.add(parent.student_id);
  }

  const links = await db.ParentStudent.findAll({
    where: { parent_id: parent.id }
  });

  links.forEach((link) => studentIds.add(link.student_id));
  return Array.from(studentIds);
};

module.exports = {
  getParentRecord,
  getLinkedStudentIds
};
