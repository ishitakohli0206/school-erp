const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


const loadModel = (path) => {
  const exported = require(path);

  // CASE 1: Factory function (sequelize, DataTypes)
  if (
    typeof exported === "function" &&
    !exported.prototype instanceof Model
  ) {
    return exported(sequelize, DataTypes);
  }

  // CASE 2: ES6 Class extends Model
  if (
    typeof exported === "function" &&
    exported.prototype instanceof Model
  ) {
    exported.init(exported.rawAttributes, {
      sequelize,
      modelName: exported.name,
      tableName: exported.tableName,
      timestamps: false
    });
    return exported;
  }

  // CASE 3: Direct sequelize.define model
  return exported;
};

/* ================================
   MODELS
================================ */
db.User = loadModel("./user");
db.Student = loadModel("./students");
db.Parent = loadModel("./parents");
db.ParentStudent = loadModel("./parent_student");
db.Class = loadModel("./classes");
db.Attendance = loadModel("./attendance");

/* ================================
   ASSOCIATIONS
================================ */

// Parent ↔ Student
db.Parent.belongsToMany(db.Student, {
  through: db.ParentStudent,
  foreignKey: "parent_id",
  otherKey: "student_id",
  timestamps: false
});

db.Student.belongsToMany(db.Parent, {
  through: db.ParentStudent,
  foreignKey: "student_id",
  otherKey: "parent_id",
  timestamps: false
});

// Class → Student
db.Class.hasMany(db.Student, { foreignKey: "class_id" });
db.Student.belongsTo(db.Class, { foreignKey: "class_id" });

// Student → Attendance
db.Student.hasMany(db.Attendance, { foreignKey: "student_id" });
db.Attendance.belongsTo(db.Student, { foreignKey: "student_id" });

module.exports = db;
