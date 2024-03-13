const axios = require('axios');
const ENV_CONTENTS = process.env;

const getPaydunyaCashoutInvoice = async (txnAmount, walletSender, walletReciever) => {
    try {
        const payloads = {
            "invoice": {
                "items": {
                    "item_0": {
                        "name": `Transfére ${walletSender} vers ${walletReciever}`,
                        "quantity": 1,
                        "unit_price": txnAmount,
                        "total_price": txnAmount,
                        "description": "Soho Transfére"
                    }
                },
                "taxes": {
                },
                "total_amount": txnAmount,
                "description": ""
            },
            "store": {
                "name": "SOHO",
                "tagline": "",
                "postal_address": "",
                "phone": "",
                "logo_url": "",
                "website_url": ""
            },
            "custom_data": {
            },
            "actions": {
                "callback_url": ENV_CONTENTS.PAYDUNYA_CASHOUT_CALLBACK
            }
        };
        var headers = {
            'PAYDUNYA-MASTER-KEY': ENV_CONTENTS.PAYDUNYA_MASTER_KEY,
            'PAYDUNYA-PRIVATE-KEY': ENV_CONTENTS.PAYDUNYA_PRIVATE_KEY,
            'PAYDUNYA-TOKEN': ENV_CONTENTS.PAYDUNYA_TOKEN
        };
        const res = await axios.post(ENV_CONTENTS.PAYDUNYA_CASHOUT_BASE_URL + 'checkout-invoice/create', payloads, { headers: headers });
        if (res.status === 200) {
            return { ...res?.data, response_code: res?.data?.response_code, "tk_invoice": res?.data?.token, "url": res?.data?.response_text };
        }
        return null;
    } catch (error) {
        throw new Error(JSON.stringify(error?.response?.data?? {"msg": error.message}));
    }

}

const getPaydunyaCashinInvoice = async (txnAmount, receiverPhone, walletReciever) => {
    try {
        const payloads = {
            "amount": txnAmount,
            "account_alias": receiverPhone,
            "withdraw_mode": walletReciever,
            "callback_url": ENV_CONTENTS.PAYDUNYA_CASHIN_CALLBACK
        };
        var headers = {
            'PAYDUNYA-MASTER-KEY': ENV_CONTENTS.PAYDUNYA_MASTER_KEY,
            'PAYDUNYA-PRIVATE-KEY': ENV_CONTENTS.PAYDUNYA_PRIVATE_KEY,
            'PAYDUNYA-TOKEN': ENV_CONTENTS.PAYDUNYA_TOKEN
        };
        const res = await axios.post(ENV_CONTENTS.PAYDUNYA_CASHIN_BASE_URL + 'disburse/get-invoice', payloads, { headers: headers });
        if (res.status === 200) {
            return { responsecode: res?.data?.response_code, "disburse_token": res?.data?.disburse_token };
        }
        return null;
    } catch (error) {
        throw new Error(JSON.stringify(error?.response?.data?? {"msg": error.message}));
    }

}

module.exports = {
    getPaydunyaCashoutInvoice,
    getPaydunyaCashinInvoice
}