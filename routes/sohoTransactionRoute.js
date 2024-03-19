const express = require('express');
const { sendMoney, confirmCashOut, confirmCashIn, cashIn, cashOut,getTransactionById,getAllTransactionForUserById } = require('../controllers/transactionController');

const sohoTransactionRoute = express.Router();

sohoTransactionRoute.post('/init', sendMoney);
sohoTransactionRoute.post('/cashin', cashIn);
sohoTransactionRoute.post('/cashout', cashOut);
sohoTransactionRoute.post('/cashout/confirm-transactions', confirmCashOut);
sohoTransactionRoute.post('/cashin/confirm-transactions', confirmCashIn);
//sohoTransactionRoute.post('/checkOverDraft', checkDailyOverdraft);
sohoTransactionRoute.get('/list/:user_id',getAllTransactionForUserById);
sohoTransactionRoute.get('/get-transaction/:transaction_id',getTransactionById);

module.exports = sohoTransactionRoute;