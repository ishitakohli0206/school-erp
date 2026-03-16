const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const QuizLink = sequelize.define(
  "QuizLink",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    class_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: "quiz_links",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
  }
);

module.exports = QuizLink;
