const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Parent = sequelize.define(
  'Parent',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    tableName: 'parents',
    timestamps: false
  }
);

module.exports = Parent;
