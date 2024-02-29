// models/Otp.js

const { DataTypes } = require('sequelize');
const sequelize = require('../storage/sequelize-config');

const Otp = sequelize.define('Otp', {
    otp_code: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    receiver: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    /** 
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    */
    canal: {
        type: DataTypes.ENUM('email', 'sms'),
        defaultValue: 'email'
    },
    status: {
        type: DataTypes.ENUM('V', 'I'),
        defaultValue: 'V'
      },
});

module.exports = Otp;
