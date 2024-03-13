// models/Fee.js
const { DataTypes } = require('sequelize');
const sequelize = require('../storage/sequelize-config');

const Fee = sequelize.define('Fee',{
        taux: {
            type: DataTypes.NUMBER,
            allowNull: false,
        },
        serviceId:{
            type: DataTypes.NUMBER,
            allowNull: false,
        }
    });

module.exports = Fee;
