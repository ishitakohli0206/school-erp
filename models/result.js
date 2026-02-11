const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Result = sequelize.define(
  "Result",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    subject_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    exam_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    max_marks: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100
    },
    obtained_marks: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    exam_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    entered_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: "results",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

module.exports = Result;
