const { Sequelize } = require("sequelize");
const sequelize = require("../config/db");

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./user");
db.Student = require("./students");
db.Parent = require("./parents")(sequelize);
db.ParentStudent = require("./parent_student");
db.Class = require("./classes");
db.Attendance = require("./attendance");
db.Notification = require("./Notification")(sequelize, Sequelize);
db.Teacher = require("./teacher")(sequelize, Sequelize);
db.Subject = require("./subject");
db.Assignment = require("./assignment");
db.Result = require("./result");
db.Fee = require("./fee");
db.Notice = require("./notice");
db.AdmissionEnquiry = require("./admissionEnquiry");
db.ExamConfig = require("./examConfig");
db.Payroll = require("./payroll");
db.FeePayment = require("./feePayment");

// Parent - Student (many-to-many)
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

// User - Parent
db.User.hasOne(db.Parent, { foreignKey: "user_id" });
db.Parent.belongsTo(db.User, { foreignKey: "user_id" });

// User - Student
db.User.hasOne(db.Student, { foreignKey: "user_id" });
db.Student.belongsTo(db.User, { foreignKey: "user_id" });

// User - Teacher
db.User.hasOne(db.Teacher, { foreignKey: "user_id" });
db.Teacher.belongsTo(db.User, { foreignKey: "user_id" });

// Class - Student
db.Class.hasMany(db.Student, { foreignKey: "class_id" });
db.Student.belongsTo(db.Class, { foreignKey: "class_id" });

// Student - Attendance
db.Student.hasMany(db.Attendance, { foreignKey: "student_id" });
db.Attendance.belongsTo(db.Student, { foreignKey: "student_id" });

// Class - Subject
db.Class.hasMany(db.Subject, { foreignKey: "class_id" });
db.Subject.belongsTo(db.Class, { foreignKey: "class_id" });

// Teacher - Subject
db.Teacher.hasMany(db.Subject, { foreignKey: "teacher_id" });
db.Subject.belongsTo(db.Teacher, { foreignKey: "teacher_id" });

// Class - Assignment
db.Class.hasMany(db.Assignment, { foreignKey: "class_id" });
db.Assignment.belongsTo(db.Class, { foreignKey: "class_id" });

// Subject - Assignment
db.Subject.hasMany(db.Assignment, { foreignKey: "subject_id" });
db.Assignment.belongsTo(db.Subject, { foreignKey: "subject_id" });

// Student - Result
db.Student.hasMany(db.Result, { foreignKey: "student_id" });
db.Result.belongsTo(db.Student, { foreignKey: "student_id" });

// Subject - Result
db.Subject.hasMany(db.Result, { foreignKey: "subject_id" });
db.Result.belongsTo(db.Subject, { foreignKey: "subject_id" });

// Student - Fee
db.Student.hasMany(db.Fee, { foreignKey: "student_id" });
db.Fee.belongsTo(db.Student, { foreignKey: "student_id" });

// Class - ExamConfig
db.Class.hasMany(db.ExamConfig, { foreignKey: "class_id" });
db.ExamConfig.belongsTo(db.Class, { foreignKey: "class_id" });

// Teacher - Payroll
db.Teacher.hasMany(db.Payroll, { foreignKey: "teacher_id" });
db.Payroll.belongsTo(db.Teacher, { foreignKey: "teacher_id" });

// Fee - FeePayment
db.Fee.hasMany(db.FeePayment, { foreignKey: "fee_id" });
db.FeePayment.belongsTo(db.Fee, { foreignKey: "fee_id" });

// Student - FeePayment
db.Student.hasMany(db.FeePayment, { foreignKey: "student_id" });
db.FeePayment.belongsTo(db.Student, { foreignKey: "student_id" });

// Class - Notice
db.Class.hasMany(db.Notice, { foreignKey: "class_id" });
db.Notice.belongsTo(db.Class, { foreignKey: "class_id" });

module.exports = db;
