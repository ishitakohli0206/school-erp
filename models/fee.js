const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Fee = sequelize.define(
  "Fee",
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
    term: {
      type: DataTypes.STRING,
      allowNull: false
    },
    amount_due: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    amount_paid: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM("pending", "partial", "paid", "overdue"),
      allowNull: false,
      defaultValue: "pending"
    },
    last_payment_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  },
  {
    tableName: "fees",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

module.exports = Fee;
