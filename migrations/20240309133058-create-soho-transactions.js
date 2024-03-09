'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.createTable('SohoTransactions', {
    //   id: {
    //     allowNull: false,
    //     autoIncrement: true,
    //     primaryKey: true,
    //     type: Sequelize.INTEGER
    //   },
    //   id: {
    //     type: Sequelize.INTEGER
    //   },
    //   txnDate: {
    //     type: Sequelize.DATE
    //   },
    //   amount: {
    //     type: Sequelize.DOUBLE
    //   },
    //   walletSender: {
    //     type: Sequelize.STRING
    //   },
    //   phoneNumberSender: {
    //     type: Sequelize.STRING
    //   },
    //   walletReciever: {
    //     type: Sequelize.STRING
    //   },
    //   phoneNumberReciever: {
    //     type: Sequelize.STRING
    //   },
    //   fullName: {
    //     type: Sequelize.STRING
    //   },
    //   ussdCode: {
    //     type: Sequelize.STRING
    //   },
    //   sohoTxnStatus: {
    //     type: Sequelize.STRING
    //   },
    //   cashoutData: {
    //     type: Sequelize.JSON
    //   },
    //   cashInData: {
    //     type: Sequelize.JSON
    //   },
    //   createdAt: {
    //     allowNull: false,
    //     type: Sequelize.DATE
    //   },
    //   updatedAt: {
    //     allowNull: false,
    //     type: Sequelize.DATE
    //   }
    // });
  },
  async down(queryInterface, Sequelize) {
    // await queryInterface.dropTable('SohoTransactions');
  }
};