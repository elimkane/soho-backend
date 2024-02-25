// models/User.js

const { DataTypes } = require('sequelize');
const sequelize = require('../storage/sequelize-config');

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false
  },
  phone_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = User;