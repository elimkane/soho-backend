// controllers/transaction.js

const User = require("../models/User");
const Transaction = require("../models/Transaction");
const paydunyaUtils = require("./paydunya/utils-paydunya");
const orangemoney = require("./wallets/orangemoney");
const axios = require('axios');
const Services = require("../models/Service")
const Fee = require('../models/Fee');

//function to registrer user with a files uploaded
async function doTransfert(req, res) {
    try {
        const {source, destination, amount} = req.body;
        // Construisez l'URL complète du fichier

        let user = await User.findByPk(source?.id_user);
        if (user) {
            //consommer api paydundya pour depot
            //1- generation invoice
            const response_invoice = await paydunyaUtils.generateCashoutInvoice(source?.operator, amount);
            if (response_invoice?.response_code !== "00") {//erreur generation facture paydunya
                res.status(406).json({message: response_invoice?.response_text});
            } else { // invoice generation OK
                const token = response_invoice.token;
                //inserer dans table transaction
                const transaction = await Transaction.create({
                    senderId: user.id,
                    operator_source: source?.operator,
                    amount,
                    depot_status: 'INIT',
                    operator_destination: destination?.operator,
                    receiver_phone_number: destination?.phone_number
                });
                // do OM transaction
                const response_transaction = await orangemoney.cashout(user, source.code, token);
                if (!response_transaction.success) { //depot echec
                    //update transaction
                    transaction.depot_status = 'ECHEC';
                    transaction.depot_message = response_transaction.message;
                    transaction.depot_return_code = '404';
                    await transaction.save();
                    res.status(406).json({message: response_transaction.message});
                } else {
                    transaction.depot_status = 'SUCCESS';
                    transaction.depot_message = response_transaction.message;
                    transaction.depot_return_code = '200';
                    await transaction.save();

                    //depot vers compte client
                    const response_generate_invoice_depot = await paydunyaUtils.generateCashinInvoice(transaction.receiver_phone_number, amount, transaction.operator_destination)
                    if (response_generate_invoice_depot?.response_code !== "00") {
                        transaction.transfert_status = 'ECHEC';
                        transaction.transfert_message = response_generate_invoice_depot.response_text;
                        transaction.transfert_return_code = '404';
                        await transaction.save();
                        res.status(406).json({message: response_generate_invoice_depot?.response_text});
                    } else {
                        const token_transfert = response_generate_invoice_depot.disburse_token;
                        const response_depot = await orangemoney.cashin(token_transfert);
                        if (response_depot?.response_code !== "00") {
                            transaction.transfert_status = 'ECHEC';
                            transaction.transfert_message = response_depot.response_text;
                            transaction.transfert_return_code = '404';
                            await transaction.save();
                            res.status(406).json({message: response_depot?.response_text});
                        } else {
                            transaction.transfert_status = 'SUCCESS';
                            transaction.transfert_message = response_depot.response_text;
                            transaction.transfert_return_code = '200';
                            await transaction.save();
                            res.status(200).json({message: 'depot reussie'});
                        }
                    }
                }
            }
        } else {
            res.status(404).json({message: "Utilisateur non trouvée"});

        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Erreur serveur"});
    }
}
/*

/!**
 * function de generation d'une facture paydunya pour le retrait
 * @param operator_source
 * @param amount
 * @returns {Promise<any>}
 *!/
async function generateInvoice(operator_source, amount) {
    const name = "Depot " + operator_source;
    let data = JSON.stringify({
        "invoice": {
            "item_0": {
                "name": name.toString(),
                "quantity": 1,
                "unit_price": amount,
                "total_price": amount,
                "description": name.toString()
            },
            "taxes": {},
            "total_amount": amount,
            "description": ""
        },
        "store": {
            "name": "MyPay",
            "tagline": "",
            "postal_address": "",
            "phone": "",
            "logo_url": "",
            "website_url": ""
        },
        "custom_data": {},
        "actions": {
            "callback_url": "http://localhost:3000/hello"
        }
    });
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://app.paydunya.com/api/v1/checkout-invoice/create',
        headers: {
            'PAYDUNYA-MASTER-KEY': 'JcOU73pG-NVJm-OYZ0-9hoT-21ZIaeqHdvtc',
            'PAYDUNYA-PRIVATE-KEY': 'live_private_H104hiqMEhG9ULjI4G63wcQpPGg',
            'PAYDUNYA-TOKEN': 'LnfLi1GUW9NSGEDIAIRG',
            'Content-Type': 'application/json'
        },
        data: data
    };

    const respone = await axios.request(config)
    return respone.data;
}

/!**
 * fonction pour effectuer une operation de retrait d'un wallet OM vers le compte paydunya
 * @param user
 * @param authorization_code
 * @param token
 * @returns {Promise<T|T|any>}
 *!/
async function om(user, authorization_code, token) {
    try {
        const axios = require('axios');
        const customer_name = user.first_name + ' ' + user.last_name;
        let data = JSON.stringify({
            "customer_name": customer_name,
            "customer_email": user.email,
            "phone_number": user.phone_number,
            "authorization_code": authorization_code,
            "invoice_token": token
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://app.paydunya.com/api/v1/softpay/orange-money-senegal',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        const response = await axios.request(config);

        // Accéder au corps JSON de la réponse
        return response.data;
    } catch (error) {
        //console.error('Erreur lors de la requête OM :', error);

        // Si c'est une erreur axios avec une réponse, retournez le corps JSON de la réponse
        if (error.response && error.response.data) {
            return error.response.data;
        }

        // throw error; // Vous pouvez choisir de lancer à nouveau l'erreur ou de retourner une valeur par défaut, selon vos besoins.
    }
}

/!**
 * fonction pour la generation de facture facture paydunya pour le depot
 * @param receiver_phone
 * @param amount
 * @param destination_operator
 * @returns {Promise<T|T|any>}
 *!/
async function generateDepotInvoice(receiver_phone, amount, destination_operator) {
    try {
        const axios = require('axios');
        let data = JSON.stringify({
            "account_alias": receiver_phone,
            "amount": amount,
            "withdraw_mode": "orange-money-senegal",
            "callback_url": "https://webhook.site/5f1ec44d-cee2-4551-866c-3abf077d2e00"
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://app.paydunya.com/api/v2/disburse/get-invoice',
            headers: {
                'PAYDUNYA-MASTER-KEY': 'JcOU73pG-NVJm-OYZ0-9hoT-21ZIaeqHdvtc',
                'PAYDUNYA-PRIVATE-KEY': 'live_private_H104hiqMEhG9ULjI4G63wcQpPGg',
                'PAYDUNYA-TOKEN': 'LnfLi1GUW9NSGEDIAIRG',
                'Content-Type': 'application/json'
            },
            data: data
        };
        const response = await axios.request(config);
        // Accéder au corps JSON de la réponse
        return response.data;

    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        }
    }

}

/!**
 * fonction paydunya pour effectuer le depot sur un wallet orangemoney
 * @param token
 * @returns {Promise<*|T|T>}
 *!/
async function omDepot(token) {
    try {
        const axios = require('axios');
        let data = JSON.stringify({
            "disburse_invoice": token
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://app.paydunya.com/api/v2/disburse/submit-invoice',
            headers: {
                'PAYDUNYA-MASTER-KEY': 'JcOU73pG-NVJm-OYZ0-9hoT-21ZIaeqHdvtc',
                'PAYDUNYA-PRIVATE-KEY': 'live_private_H104hiqMEhG9ULjI4G63wcQpPGg',
                'PAYDUNYA-TOKEN': 'LnfLi1GUW9NSGEDIAIRG',
                'Content-Type': 'application/json'
            },
            data: data
        };
        console.log(data);
        const response = await axios.request(config);
        //console.log(response.data);
        // Accéder au corps JSON de la réponse
        return response.data;
    } catch (error) {
        //console.log(error);
        if (error.response && error.response.data) {
            return error.response.data;
        } else {
            return error;
        }
    }


}
*/

async function getAllService (req,res){
    const sources = await Services.findAll({
        where: {source : 1},
        include: [
            {
                model: Fee,
                attributes: ['taux'], // Ajouter les colonnes de la table "fee" que vous souhaitez récupérer
            }
        ]});
    const destinations = await Services.findAll({
        where: {destination : 1},
        include: [
            {
                model: Fee,
                attributes: ['taux'], // Ajouter les colonnes de la table "fee" que vous souhaitez récupérer
            }
        ]});
    const data = {
        source : sources,
        destinations : destinations
    }
    return res.status(200).json(data);
}


module.exports = {
    doTransfert,
    getAllService
};
