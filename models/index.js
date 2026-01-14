const Sequelize = require("sequelize");
const sequelize = require("../config/db");

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./user")(sequelize, Sequelize);
db.Class = require("./classes")(sequelize, Sequelize);
db.Student = require("./students")(sequelize, Sequelize);
db.Parent = require("./parents")(sequelize, Sequelize);
db.ParentStudent = require("./parent_student")(sequelize, Sequelize);


db.Student.belongsTo(db.User, { foreignKey: "user_id" });
db.Parent.belongsTo(db.User, { foreignKey: "user_id" });

db.Parent.belongsToMany(db.Student, {
  through: db.ParentStudent,
  foreignKey: "parent_id",
});

db.Student.belongsToMany(db.Parent, {
  through: db.ParentStudent,
  foreignKey: "student_id",
});

module.exports = db;
