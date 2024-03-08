const axios = require("axios");

/**
 * function de generation d'une facture paydunya pour le retrait
 * @param operator_source
 * @param amount
 * @returns {Promise<any>}
 */
async function generateCashoutInvoice(operator_source, amount) {
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

/**
 * fonction pour effectuer une operation de retrait d'un wallet OM vers le compte paydunya
 * @param user
 * @param authorization_code
 * @param token
 * @returns {Promise<T|T|any>}
 */


async function generateCashinInvoice(receiver_phone, amount, destination_operator) {
    try {
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

/**
 * fonction paydunya pour effectuer le depot sur un wallet orangemoney
 * @param token
 * @returns {Promise<*|T|T>}
 */


module.exports = {
    generateCashoutInvoice,
    generateCashinInvoice

};
