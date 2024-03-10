const express = require('express');
const { sendMoney, confirmCashOut, confirmCashIn, cashIn } = require('../controllers/transactionController');

const sohoTransactionRoute = express.Router();

sohoTransactionRoute.post('/init', sendMoney);
sohoTransactionRoute.post('/cashin', cashIn);
sohoTransactionRoute.post('/cashout/confirm-transactions', confirmCashOut);
sohoTransactionRoute.post('/cashin/confirm-transactions', confirmCashIn);



module.exports = sohoTransactionRoute;