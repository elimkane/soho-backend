const axios = require('axios');
const ENV_CONTENTS = process.env;

const cashOutOmBk = async (fullName, phoneNumber, ussd_code,  invoice_token) => {
    try {
        var payloads = {
            "name_bf": fullName,
            "email_bf": "",
            "phone_bf": phoneNumber,
            "otp_code": ussd_code,
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
    cashOutOmBk
}