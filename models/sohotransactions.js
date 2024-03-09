const { DataTypes } = require('sequelize');
const sequelize = require('../storage/sequelize-config');

const SohoTransactions = sequelize.define('SohoTransactions', 
{
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  userId: {
    allowNull: false,
    type: DataTypes.INTEGER
  },
  txnDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  amount: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  walletSender: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phoneNumberSender: {
    type: DataTypes.STRING,
    allowNull: false
  },
  walletReciever: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phoneNumberReciever: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tokenInvoice: {
    type: DataTypes.STRING,
    allowNull: false
  },
  disburseToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ussdCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  sohoTxnStatus: {
    type: DataTypes.ENUM('INIT', 'PROGRESS','SUCCESS', 'ECHEC'),
    allowNull: false,
    defaultValue: 'INIT',
  },
  cashoutData: {
    type: DataTypes.JSON,
    allowNull: true
  },
  cashInData: {
    type: DataTypes.JSON,
    allowNull: true
  },
});

module.exports = SohoTransactions;
