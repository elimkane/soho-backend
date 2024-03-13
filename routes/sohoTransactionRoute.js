const express = require('express');
const { sendMoney, confirmCashOut, confirmCashIn, cashIn, cashOut,checkDailyOverdraft } = require('../controllers/transactionController');

const sohoTransactionRoute = express.Router();

sohoTransactionRoute.post('/init', sendMoney);
sohoTransactionRoute.post('/cashin', cashIn);
sohoTransactionRoute.post('/cashout', cashOut);
sohoTransactionRoute.post('/cashout/confirm-transactions', confirmCashOut);
sohoTransactionRoute.post('/cashin/confirm-transactions', confirmCashIn);
//sohoTransactionRoute.post('/checkOverDraft', checkDailyOverdraft);



module.exports = sohoTransactionRoute;