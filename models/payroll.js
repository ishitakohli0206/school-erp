const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Payroll = sequelize.define(
  "Payroll",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    month: {
      type: DataTypes.STRING,
      allowNull: false
    },
    base_salary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    deductions: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    bonus: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    net_salary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM("pending", "processed", "paid"),
      allowNull: false,
      defaultValue: "pending"
    },
    paid_on: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    processed_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: "payroll",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

module.exports = Payroll;
