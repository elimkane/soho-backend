// models/User.js

const { DataTypes } = require('sequelize');
const sequelize = require('../storage/sequelize-config');
const Transaction = require('./Transaction');  // Assurez-vous que le chemin est correct
const SohoTransaction = require('./sohotransactions');  // Assurez-vous que le chemin est correct
const Otp = require('./Otp');  // Assurez-vous que le chemin est correct


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
    type: DataTypes.ENUM('INIT', 'KYC', 'VERIFIED'),
    defaultValue: 'INIT'
  },
  pays_iso_2: {
    type: DataTypes.STRING,
    allowNull: false
  },
  recto: {
    type: DataTypes.STRING,
    allowNull: true, // Peut être null si vous le souhaitez
  },
  verso: {
    type: DataTypes.STRING,
    allowNull: true, // Peut être null si vous le souhaitez
  },
  profil: {
    type: DataTypes.STRING,
    allowNull: true, // Peut être null si vous le souhaitez
  },
});

User.hasMany(Transaction, { foreignKey: 'senderId' });
User.hasMany(SohoTransaction, { foreignKey: 'userId' });
//User.hasMany(Otp, { foreignKey: 'userId' });


module.exports = User;