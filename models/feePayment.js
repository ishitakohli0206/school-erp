const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const FeePayment = sequelize.define(
  "FeePayment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    fee_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    payment_method: {
      type: DataTypes.ENUM("online", "cash", "bank"),
      allowNull: false,
      defaultValue: "online"
    },
    reference_no: {
      type: DataTypes.STRING,
      allowNull: false
    },
    paid_on: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    received_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    tableName: "fee_payments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
  }
);

module.exports = FeePayment;
