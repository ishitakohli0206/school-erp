const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Notice = sequelize.define(
  "Notice",
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
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    target_role: {
      type: DataTypes.ENUM("all", "admin", "teacher", "student", "parent"),
      allowNull: false,
      defaultValue: "all"
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
    tableName: "notices",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
  }
);

module.exports = Notice;
