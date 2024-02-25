// sequelize-config.js

const Sequelize = require('sequelize');

const sequelize = new Sequelize('soho', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;