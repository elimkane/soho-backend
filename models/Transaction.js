// models/Transaction.js

const { DataTypes } = require('sequelize');
const sequelize = require('../storage/sequelize-config');

const Transaction = sequelize.define('Transaction', {
    senderId : {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    operator_source: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    depot_status:{
        type: DataTypes.ENUM('INIT', 'SUCCESS','ECHEC'),
        defaultValue: 'INIT'
    },
    depot_return_code:{
        type: DataTypes.INTEGER,
        allowNull : true
    },
    depot_message:{
        type: DataTypes.STRING,
        allowNull : true
    },
    operator_destination: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    receiver_phone_number:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    transfert_status:{
        type: DataTypes.ENUM('INIT', 'SUCCESS','ECHEC'),
        defaultValue: 'INIT'
    },
    transfert_return_code:{
        type: DataTypes.INTEGER,
        allowNull : true
    },
    transfert_message:{
        type: DataTypes.STRING,
        allowNull : true
    },
});

module.exports = Transaction;
