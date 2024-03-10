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

const sendMoney = async (req, res) => {
    try {
        const { amount, walletSender, phoneNumberSender, walletReciever, phoneNumberReciever, fullName, ussdCode, userId } = req.body;
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

        const { tk_invoice, url } = await getPaydunyaCashoutInvoice(amount, walletSender, walletReciever);
        console.log("INCOICE ====", tk_invoice);
        if (!tk_invoice) {
            return res.status(500).send({ status: false, message: url });
        }
        const txnInitiated = await handleCashOutTransaction(tk_invoice, walletSender, phoneNumberSender, fullName, ussdCode);
        console.log(txnInitiated);
        if (!txnInitiated) {
            return res.status(500).send({ status: false, message: "Le wallet sender est incorrect." });
        }
        if (walletSender.includes("wave")) {
            // TODO SEND SMS TO CUSTOMER IF WALLETSENDER IS WAVE
        }
        // TODO SAVE TXN IN DATABASE
        const txn = await SohoTransactions.create(
            {
                userId,
                amount,
                walletSender,
                phoneNumberSender,
                walletReciever,
                phoneNumberReciever,
                fullName,
                ussdCode,
                tokenInvoice: tk_invoice
            }
        );
        return res.status(201).send({ status: true, message: "Transaction inité avec success", data: txnInitiated });
    } catch (error) {
        // console.log(error.message);
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
        console.log(req.body.data);
        const {data} = req.body;
        const { response_code, invoice, status, fail_reason, customer } = data;
        console.log("CASHOUT RECIEVED NOTIF => ", { response_code, invoice, status, fail_reason, customer });

        let txn = await SohoTransactions.findOne({ where: { tokenInvoice: invoice?.token ?? "" } });
        if (!txn) {
            return res.status(200).send({ message: 'Well recieved', status: true });
        }
        txn.cashoutData = JSON.parse(JSON.stringify({ response_code, invoice, status, fail_reason, customer }));
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
        console.log("CASHINT INITIATED => ", cashIn);
        await txn.save();
        return res.status(200).send({ message: 'Well recieved', status: true });
    } catch (error) {
        console.log(error.message);
        return res.status(200).send({ message: 'Well recieved', status: true });
    }
}

const confirmCashIn = async (req, res) => {
    try {
        const { status, token, withdraw_mode, amount, updated_at, disburse_id, transaction_id, disburse_tx_id } = req.body;
        console.log("CASHIN RECIEVED NOTIF => ", { status, token, withdraw_mode, amount, updated_at, disburse_id, transaction_id, disburse_tx_id });
        let txn = await SohoTransactions.findOne({ where: { disburseToken: token ?? "" } });
        if (!txn) {
            return res.status(200).send({ message: 'Well recieved', status: true });
        }
        txn.cashInData = JSON.parse(JSON.stringify({ status, token, withdraw_mode, amount, updated_at, disburse_id, transaction_id, disburse_tx_id }));
        if (status !== "success") {
            // txn.sohoTxnStatus = 'ECHEC';
            await txn.save();
            return res.status(200).send({ message: 'Well recieved', status: true });
        }
        txn.sohoTxnStatus = 'SUCCESS';
        await txn.save();
        return res.status(200).send({ message: 'Well recieved', status: true });
    } catch (error) {
        console.log(error.message);
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
        case paydunyaWalletsType.omCI:
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

module.exports = {
    sendMoney,
    confirmCashOut,
    confirmCashIn,
    cashIn
}