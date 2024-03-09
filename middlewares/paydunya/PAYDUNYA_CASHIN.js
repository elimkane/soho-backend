const axios = require('axios');
const ENV_CONTENTS = process.env;

const paydunyaCashIn = async (disburse_invoice, disburse_id) => {
    try {
        var payloads = {
            "orange_money_ci_customer_fullname": fullName,
            "orange_money_ci_email": "",
            "orange_money_ci_phone_number": phoneNumber,
            "orange_money_ci_otp": ussd_code,
            "payment_token": invoice_token
        };
        const res = await axios.post(ENV_CONTENTS.PAYDUNYA_CASHOUT_BASE_URL + 'softpay/orange-money-ci', payloads);
         //TODO : LOGS
        return res.data;
    } catch (error) {
         //TODO : LOGS
        return null;
    }

}

module.exports = {
    paydunyaCashIn
}