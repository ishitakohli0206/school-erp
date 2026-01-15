const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ParentStudent = sequelize.define(
  'ParentStudent',
  {
    parent_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    student_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    }
  },
  {
    tableName: 'parent_student',
    timestamps: false
  }
);

module.exports = ParentStudent;
