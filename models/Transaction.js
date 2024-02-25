// models/Transaction.js

const { DataTypes } = require('sequelize');
const sequelize = require('../storage/sequelize-config');

const Transaction = sequelize.define('Transaction', {
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    recipientEmail: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Transaction;
