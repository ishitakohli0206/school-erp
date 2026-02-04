const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Class = sequelize.define(
  'Class',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    class_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    section: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: 'classes',
    timestamps: false
  }
);
module.exports = (sequelize, DataTypes) => {
  const Class = sequelize.define("Class", {
    class_name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  Class.associate = (models) => {
    Class.hasMany(models.students, {
      foreignKey: "class_id"
    });
  };

  return Class;
};

module.exports = Class;
