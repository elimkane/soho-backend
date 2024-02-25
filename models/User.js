// models/User.js

const { DataTypes } = require('sequelize');
const sequelize = require('../storage/sequelize-config');
const Transaction = require('./Transaction');  // Assurez-vous que le chemin est correct

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
  state: {
    type: DataTypes.ENUM('INIT', 'VERIFIED'),
    defaultValue: 'INIT'
  },
  otp_code: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

User.hasMany(Transaction, { foreignKey: 'senderId' });

module.exports = User;