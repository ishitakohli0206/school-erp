module.exports = (sequelize, DataTypes) => {
  const classes = sequelize.define(
    "classes",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
      tableName: "classes",
      timestamps: false
    }
  );

  return classes;
};
