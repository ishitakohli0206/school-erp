module.exports = (sequelize, DataTypes) => {
  const Parents = sequelize.define(
    "Parents",
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      tableName: "parents",
      timestamps: false
    }
  );

  return Parents;
};
