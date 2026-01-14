module.exports = (sequelize, DataTypes) => {
  const ParentStudent = sequelize.define(
    "ParentStudent",
    {
      parent_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "parent_student",
      timestamps: false,
    }
  );

  return ParentStudent;
};
