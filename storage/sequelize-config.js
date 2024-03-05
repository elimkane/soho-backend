// sequelize-config.js

const Sequelize = require('sequelize');
const {resolve} = require("path");

const sequelize = new Sequelize('soho', 'doadmin', 'AVNS_5o3OvIWhCfcA4UXMDdJ', {
  host: 'soho-do-user-15975293-0.c.db.ondigitalocean.com',
  port:25060,
  dialect: 'mysql'
});

module.exports = sequelize;