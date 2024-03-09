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
const { cashOutEmoneySn } = require("../middlewares/paydunya/SN_EMONEY");
const { cashOutFmSn } = require("../middlewares/paydunya/SN_FREEMONEY");
const { cashOutOmSn } = require("../middlewares/paydunya/SN_OM");
const { cashOutWaveSn } = require("../middlewares/paydunya/SN_WAVE");
const { cashOutWizallSn } = require("../middlewares/paydunya/SN_WIZALL");
const { cashOutMoovTg } = require("../middlewares/paydunya/TG_MOOV");
const { cashOutTmoneyTg } = require("../middlewares/paydunya/TG_TMONEY");
const { getPaydunyaCashoutInvoice } = require("../middlewares/paydunya/paydunya_invoice");
const { paydunyaWalletsType } = require("../utils/paydunyaWalletType");

const sendMoney = async (req, res) => {
    try {
        const { amount, walletSender, phoneNumberSender, walletReciever, phoneNumberReciever, fullName, ussdCode } = req.body;
        if (amount) {
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

        const { tk_invoice, url } = await getPaydunyaCashoutInvoice(amount, "orange-money-senegal", "orange-money-ci ");
        if (!tk_invoice) {
            return res.status(500).send({ status: false, message: url });
        }
        const txnInitiated = await handleCashOutTransaction(tk_invoice, walletSender, phoneNumberSender, fullName, ussdCode);
        if (!txnInitiated) {
            return res.status(500).send({ status: false, message: "Le wallet sender est incorrect." });
        }
        if (walletSender.includes("wave")) {
            // TODO SEND SMS TO CUSTOMER IF WALLETSENDER IS WAVE
        }
        // TODO SAVE TXN IN DATABASE
        return res.status(201).send({ status: true, message: "Transaction inité avec success", data: txnInitiated });
    } catch (error) {

    }
}

const confirmCashOut = async (req, res) => {
    try {
        console.log(req.body);
    } catch (error) {

    }
}

const confirmCashIn = async (req, res) => {
    try {
        console.log(req.body);
    } catch (error) {

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
    confirmCashIn
}