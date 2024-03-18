const { cashOutMoovBk } = require("../middlewares/paydunya/BK_MOOV");
const { cashOutOmBk } = require("../middlewares/paydunya/BK_OM");
const { cashOutMoovBn } = require("../middlewares/paydunya/BN_MOOV");
const { cashOutMtnBn } = require("../middlewares/paydunya/BN_MTN");
const { cashOutMoovCi } = require("../middlewares/paydunya/CI_MOOV");
const { cashOutMtnCi } = require("../middlewares/paydunya/CI_MTN");
const { cashOutOmCi } = require("../middlewares/paydunya/CI_OM");
const { cashOutWaveCi } = require("../middlewares/paydunya/CI_WAVE");
const { cashOutMoovMl } = require("../middlewares/paydunya/LM_MOOV");
const { cashOutOmMl } = require("../middlewares/paydunya/ML_OM");
const { paydunyaCashIn } = require("../middlewares/paydunya/PAYDUNYA_CASHIN");
const { cashOutEmoneySn } = require("../middlewares/paydunya/SN_EMONEY");
const { cashOutFmSn } = require("../middlewares/paydunya/SN_FREEMONEY");
const { cashOutOmSn } = require("../middlewares/paydunya/SN_OM");
const { cashOutWaveSn } = require("../middlewares/paydunya/SN_WAVE");
const { cashOutWizallSn } = require("../middlewares/paydunya/SN_WIZALL");
const { cashOutMoovTg } = require("../middlewares/paydunya/TG_MOOV");
const { cashOutTmoneyTg } = require("../middlewares/paydunya/TG_TMONEY");
const { getPaydunyaCashoutInvoice, getPaydunyaCashinInvoice } = require("../middlewares/paydunya/PAYDUNYA_INVOICE");
const { paydunyaWalletsType } = require("../utils/paydunyaWalletType");
const SohoTransactions = require("../models/sohotransactions");
const { Sequelize, Op } = require('sequelize');
const sequelize = require('../storage/sequelize-config');

const ENV_CONTENTS = process.env;

const sendMoney = async (req, res) => {
    try {
        const { amount,totalAmount, walletSender, phoneNumberSender, walletReciever, phoneNumberReciever, fullName, ussdCode, userId } = req.body;
        //const { amount, walletSender, phoneNumberSender, walletReciever, phoneNumberReciever, fullName, ussdCode, userId } = req.body;
        if (!amount) {
            return res.status(500).send({ status: false, message: "Le montant de la transaction est obligatoire." });
        }
        if (!(walletSender && walletReciever)) {
            return res.status(500).send({ status: false, message: "Les wallet Origin et Destinataire sont obligatoire." });
        }
        if (!(phoneNumberSender && phoneNumberReciever)) {
            return res.status(500).send({ status: false, message: "Les numéro de téléphone Origin et Destinataire sont obligatoire." });
        }
        if (walletSender.includes("orange-money") && !ussdCode) {
            return res.status(500).send({ status: false, message: "Le provider code est obligatoire pour les transaction orange money." });
        }

        //check transaction limit
        //check overdraft for the day
       const isDailyOverdraftDepassed = await checkDailyOverdraft(userId);
        if (isDailyOverdraftDepassed){
            return res.status(401).send({ status: false, message: "Limite transactionnel journalier dépassée." });
        }
        //check overdraft for the month
        const isMonthlyOverdraftDepassed = await checkMonthlyOverdraft(userId);
        if (isMonthlyOverdraftDepassed){
            return res.status(401).send({ status: false, message: "Limite transactionnel mensuel dépassée." });
        }

        const checkoutInvoice = await getPaydunyaCashoutInvoice(totalAmount, walletSender, walletReciever);
        //const checkoutInvoice = await getPaydunyaCashoutInvoice(amount, walletSender, walletReciever);
        const { tk_invoice, url } = checkoutInvoice;
      
        // console.log("INCOICE ====", tk_invoice);
        if (!tk_invoice) {
            return res.status(500).send({ status: false, message: url });
        }
        const txnInitiated = walletSender !== paydunyaWalletsType.card ? await handleCashOutTransaction(tk_invoice, walletSender, phoneNumberSender, fullName, ussdCode) : checkoutInvoice;
        if (!txnInitiated) {
            return res.status(500).send({ status: false, message: "Le wallet sender est incorrect." });
        }
        if (walletSender.includes("wave")) {
            // TODO SEND WAVE URL ON SMS TO CUSTOMER IF WALLETSENDER IS WAVE
        }
        const txn = await SohoTransactions.create({
            userId,
            totalAmount,
            amount,
            walletSender,
            phoneNumberSender,
            walletReciever,
            phoneNumberReciever,
            fullName,
            ussdCode,
            tokenInvoice: tk_invoice,
            cashoutData: JSON.parse(JSON.stringify(txnInitiated))
        });
        return res.status(201).send({ status: true, message: "Transaction inité avec success", data: txnInitiated });
    } catch (error) {
        return res.status(500).send({ status: false, message: "Erreur lors de l'initiation de la transaction", error: error.message });
    }
}

const cashOut = async (req, res) => {
    try {
        const { amount, phoneNumber, wallette, fullName, ussdCode } = req.body;
        if (!amount) {
            return res.status(500).send({ status: false, message: "Le montant de la transaction est obligatoire." });
        }
        if (!(wallette)) {
            return res.status(500).send({ status: false, message: "Les wallet est obligatoire." });
        }
        if (!(phoneNumber && fullName)) {
            return res.status(500).send({ status: false, message: "Les numéro de téléphone et Nom complete sont obligatoire." });
        }
        if (wallette.includes("orange-money") && !ussdCode) {
            return res.status(500).send({ status: false, message: "Le provider code est obligatoire pour les transaction orange money." });
        }
        const { tk_invoice, url } = await getPaydunyaCashoutInvoice(amount, "Cash Out", "");
        if (!tk_invoice) {
            return res.status(500).send({ status: false, message: url });
        }
        const txnInitiated = await handleCashOutTransaction(tk_invoice, wallette, phoneNumber, fullName, ussdCode);
        if (!txnInitiated) {
            return res.status(500).send({ status: false, message: "Le wallet est incorrect." });
        }
        return res.status(200).send({ message: 'Transaction inité avec succés.', status: true, data: txnInitiated });
    } catch (error) {
        return res.status(500).send({ status: false, message: "Erreur lors de l'initiation de la transaction", error: error.message });
    }
}

const cashIn = async (req, res) => {
    try {
        const { amount, phoneNumber, wallette } = req.body;
        const { disburse_token, responsecode } = await getPaydunyaCashinInvoice(amount, phoneNumber, wallette);
        const cashIn = await paydunyaCashIn(disburse_token, "1387");
        return res.status(200).send({ message: 'Well recieved', status: true, cashIn, disburse_token });
    } catch (error) {
        return res.status(500).send({ status: false, message: "Erreur lors de l'initiation de la transaction", error: error.message });
    }
}

const confirmCashOut = async (req, res) => {
    try {
        const { data } = req.body;
        const { response_code, invoice, status, fail_reason, customer } = data;
        // console.log("CASHOUT RECIEVED NOTIF => ", { response_code, invoice, status, fail_reason, customer });

        let txn = await SohoTransactions.findOne({ where: { tokenInvoice: invoice?.token ?? "" } });
        if (!txn) {
            return res.status(200).send({ message: 'Well recieved', status: true });
        }
        txn.cashoutData = JSON.parse(JSON.stringify(data));
        if (status === "failed") {
            txn.sohoTxnStatus = 'ECHEC';
            await txn.save();
            return res.status(200).send({ message: 'Well recieved', status: true });
        }


        txn.sohoTxnStatus = 'PROGRESS';
        const { disburse_token, responsecode } = await getPaydunyaCashinInvoice(txn.amount, txn.phoneNumberReciever, txn.walletReciever);
        if (!disburse_token) {
            return res.status(200).send({ message: 'Well recieved', status: true });
        }
        txn.disburseToken = disburse_token;
        const cashIn = await paydunyaCashIn(disburse_token, txn.id);
        txn.cashInData = JSON.parse(JSON.stringify(cashIn));
        // console.log("CASHINT INITIATED => ", cashIn);
        await txn.save();
        return res.status(200).send({ message: 'Well recieved', status: true });
    } catch (error) {
        // console.log(error.message);
        return res.status(200).send({ message: 'Well recieved', status: true });
    }
}

const confirmCashIn = async (req, res) => {
    try {
        const { data } = req.body;
        const { status, token, withdraw_mode, amount, updated_at, disburse_id, transaction_id, disburse_tx_id } = data;
        // console.log("CASHIN RECIEVED NOTIF => ", { status, token, withdraw_mode, amount, updated_at, disburse_id, transaction_id, disburse_tx_id });
        let txn = await SohoTransactions.findOne({ where: { disburseToken: token ?? "" } });
        if (!txn) {
            return res.status(200).send({ message: 'Well recieved', status: true });
        }
        txn.cashInData = JSON.parse(JSON.stringify(data));
        if (status !== "success") {
            await txn.save();
            return res.status(200).send({ message: 'Well recieved', status: true });
        }
        txn.sohoTxnStatus = 'SUCCESS';
        await txn.save();
        return res.status(200).send({ message: 'Well recieved', status: true });
    } catch (error) {
        // console.log(error.message);
        return res.status(200).send({ message: 'Well recieved', status: true });
    }
}


const handleCashOutTransaction = async (invoiceToken, walletSender, phoneNumber, fullName, ussd_code) => {
    switch (walletSender) {
        case paydunyaWalletsType.omSN:
            return await cashOutOmSn(fullName, phoneNumber, ussd_code, invoiceToken);
        case paydunyaWalletsType.waveSN:
            return await cashOutWaveSn(fullName, phoneNumber, invoiceToken);
        case paydunyaWalletsType.fmSN:
            return await cashOutFmSn(fullName, phoneNumber, invoiceToken);
        case paydunyaWalletsType.expSN:
            return await cashOutEmoneySn(fullName, phoneNumber, invoiceToken);
        case paydunyaWalletsType.wizallSN:
            return await cashOutWizallSn(fullName, phoneNumber, invoiceToken);


        case paydunyaWalletsType.omCI:
            return await cashOutOmCi(fullName, phoneNumber, ussd_code, invoiceToken);
        case paydunyaWalletsType.moovCI:
            return await cashOutMoovCi(fullName, phoneNumber, invoiceToken);
        case paydunyaWalletsType.mtnCI:
            return await cashOutMtnCi(fullName, phoneNumber, ussd_code, invoiceToken);
        case paydunyaWalletsType.waveCI:
            return await cashOutWaveCi(fullName, phoneNumber, invoiceToken);

        case paydunyaWalletsType.moovML:
            return await cashOutMoovMl(fullName, phoneNumber, invoiceToken);
        case paydunyaWalletsType.omML:
            return await cashOutOmMl(fullName, phoneNumber, ussd_code, invoiceToken);

        case paydunyaWalletsType.tmoTG:
            return await cashOutTmoneyTg(fullName, phoneNumber, invoiceToken);
        case paydunyaWalletsType.moovTG:
            return await cashOutMoovTg(fullName, phoneNumber, invoiceToken);


        case paydunyaWalletsType.moovBN:
            return await cashOutMoovBn(fullName, phoneNumber, invoiceToken);
        case paydunyaWalletsType.mntBN:
            return await cashOutMtnBn(fullName, phoneNumber, ussd_code, invoiceToken);


        case paydunyaWalletsType.moovBK:
            return await cashOutMoovBk(fullName, phoneNumber, invoiceToken);
        case paydunyaWalletsType.omBK:
            return await cashOutOmBk(fullName, phoneNumber, ussd_code, invoiceToken);


        default:
            return null;
    }
}

async function checkDailyOverdraft(req,res) {
    console.log('check daily limit');
    const sumDailyTransaction = await SohoTransactions.sum(
        'amount',{
            where:{
                userId: 1,
                txnDate: {
                    [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)),
                    [Op.lt]: new Date(new Date().setHours(23, 59, 59, 999)),
                }
            }
        }
    );
    console.log('sum amount of transaction for the day',sumDailyTransaction);
    return  sumDailyTransaction >= ENV_CONTENTS.LIMIT_DAILY;

}
async function checkMonthlyOverdraft(userId) {
    console.log('check monthly limit');
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const sumMonthlyTransaction = await SohoTransactions.sum(
        'amount',{
            where:{
                userId: userId,
                txnDate: {
                    [Op.gte]: firstDayOfMonth,
                    [Op.lte]: lastDayOfMonth,
                }
            }
        }
    );
    console.log('sum amount of transaction for the month',sumMonthlyTransaction);
    return  sumMonthlyTransaction >= ENV_CONTENTS.LIMIT_MONTHLY;
}

module.exports = {
    sendMoney,
    confirmCashOut,
    confirmCashIn,
    cashIn,
    cashOut,
    checkDailyOverdraft
}