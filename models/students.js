const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Student = sequelize.define(
  "Student",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    class_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: "students",
    timestamps: false
  }
);

Student.associate = (models) => {
  Student.belongsTo(models.classes, {
    foreignKey: "class_id"
  });
  Student.belongsTo(models.user, {
    foreignKey: "user_id"
  });
};

module.exports = Student;
