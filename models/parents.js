const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Parent = sequelize.define(
    "Parent",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "parents",
      timestamps: false,
    }
  );

  return Parent;
};
