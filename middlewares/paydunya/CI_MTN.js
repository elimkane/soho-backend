const axios = require('axios');
const ENV_CONTENTS = process.env;

const cashOutMtnCi = async (fullName, phoneNumber, ussd_code, invoice_token) => {
    try {
        var payloads = {
            "mtn_ci_customer_fullname": fullName,
            "mtn_ci_email": "",
            "mtn_ci_phone_number": phoneNumber,
            "mtn_ci_wallet_provider": ussd_code,
            "payment_token": invoice_token
        };
        const res = await axios.post(ENV_CONTENTS.PAYDUNYA_CASHOUT_BASE_URL + 'softpay/mtn-ci', payloads);
        return res.data;
    } catch (error) {
        throw new Error(JSON.stringify(error?.response?.data?? {"msg": error.message}));
    }

}

module.exports = {
    cashOutMtnCi
}