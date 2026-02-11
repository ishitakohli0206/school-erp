const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Subject = sequelize.define(
  "Subject",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    class_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    tableName: "subjects",
    timestamps: false
  }
);

module.exports = Subject;
