// models/Fee.js
const { DataTypes } = require('sequelize');
const sequelize = require('../storage/sequelize-config');

const Fee = sequelize.define('Fee',{
        taux: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        serviceId:{
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    });

module.exports = Fee;
