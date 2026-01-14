module.exports = (sequelize, DataTypes) => {
  const Students = sequelize.define(
    "Students",
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      class_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      tableName: "students",
      timestamps: false
    }
  );

  return Students;
};
