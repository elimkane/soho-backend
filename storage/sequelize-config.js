const Sequelize = require('sequelize');
const { resolve } = require("path");

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABSE_USER, process.env.DATABASE_PWD, {
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  dialect: 'mysql',
  logging: true
});

module.exports = sequelize;