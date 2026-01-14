const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql", // or "postgres"
    logging: false
  }
);
console.log("DB NAME:", process.env.DB_NAME);

module.exports = sequelize;
