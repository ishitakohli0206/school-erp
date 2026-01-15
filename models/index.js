const sequelize = require("../config/db");


const User = require("./user");
const Student = require("./students");
const Parent = require("./parents");
const ParentStudent = require("./parent_student");
const Class = require("./classes");
const Attendance = require("./attendance");


Parent.belongsToMany(Student, {
  through: ParentStudent,
  foreignKey: "parent_id",
  otherKey: "student_id"
});

Student.belongsToMany(Parent, {
  through: ParentStudent,
  foreignKey: "student_id",
  otherKey: "parent_id"
});

Class.hasMany(Student, { foreignKey: "class_id" });
Student.belongsTo(Class, { foreignKey: "class_id" });


module.exports = {
  sequelize,
  User,
  Student,
  Parent,
  ParentStudent,
  Class,
  Attendance
};
