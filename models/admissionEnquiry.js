const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const AdmissionEnquiry = sequelize.define(
  "AdmissionEnquiry",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    parent_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    student_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    class_interested: {
      type: DataTypes.STRING,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM("new", "contacted", "closed"),
      allowNull: false,
      defaultValue: "new"
    }
  },
  {
    tableName: "admission_enquiries",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

module.exports = AdmissionEnquiry;
