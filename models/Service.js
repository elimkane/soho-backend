const { DataTypes } = require('sequelize');
const sequelize = require('../storage/sequelize-config');
const Fee = require("./Fee");

const Service = sequelize.define('Service',
    {
        libelle: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type:{
            type: DataTypes.ENUM('CARTE', 'MOBILE-MONEY'),
            defaultValue: ''
        },
        slug:{
            type: DataTypes.STRING,
            allowNull : true
        },
        pays_iso_2:{
            type: DataTypes.STRING,
            allowNull : true
        },
        source: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        destination:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
        }
    });

module.exports = Service;
Service.hasMany(Fee, { foreignKey: 'serviceId' });
