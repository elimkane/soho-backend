const express = require('express');
const { sendMoney, confirmCashOut, confirmCashIn } = require('../controllers/transactionController');

const sohoTransactionRoute = express.Router();

sohoTransactionRoute.post('/init', sendMoney);
sohoTransactionRoute.post('/cashout/confirm-transactions', confirmCashOut);
sohoTransactionRoute.post('/cashin/confirm-transactions', confirmCashIn);


module.exports = sohoTransactionRoute;