const axios = require('axios');
const ENV_CONTENTS = process.env;

const cashOutMtnBn = async (fullName, phoneNumber, ussd_code, invoice_token) => {
    try {
        var payloads = {
            "mtn_benin_customer_fullname": fullName,
            "mtn_benin_email": "",
            "mtn_benin_phone_number": phoneNumber,
            "mtn_benin_wallet_provider": ussd_code,
            "payment_token": invoice_token
        };
        const res = await axios.post(ENV_CONTENTS.PAYDUNYA_CASHOUT_BASE_URL + 'softpay/orange-money-bf', payloads);
         //TODO : LOGS
        return res.data;
    } catch (error) {
         //TODO : LOGS
        return null;
    }

}

module.exports = {
    cashOutMtnBn
}