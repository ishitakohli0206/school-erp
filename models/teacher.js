module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define("Teacher", {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: DataTypes.STRING,
    subject: DataTypes.STRING,
    class_teacher_of: DataTypes.INTEGER
  }, {
    tableName: "teachers",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });

  return Teacher;
};