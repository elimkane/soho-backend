const axios = require('axios');
const ENV_CONTENTS = process.env;

const cashOutMoovTg = async (fullName, phoneNumber, invoice_token) => {
    try {
        var payloads = {
            "moov_togo_customer_fullname": fullName,
            "moov_togo_email": "",
            "moov_togo_customer_address": "",
            "moov_togo_phone_number": phoneNumber,
            "payment_token": invoice_token
        };
        const res = await axios.post(ENV_CONTENTS.PAYDUNYA_CASHOUT_BASE_URL + 'softpay/moov-togo', payloads);
         //TODO : LOGS
        return res.data;
    } catch (error) {
         //TODO : LOGS
        return null;
    }

}

module.exports = {
    cashOutMoovTg
}