const axios = require('axios');
const ENV_CONTENTS = process.env;

const cashOutOmCi = async (fullName, phoneNumber, ussd_code, invoice_token) => {
    try {
        var payloads = {
            "orange_money_ci_customer_fullname": fullName,
            "orange_money_ci_email": "",
            "orange_money_ci_phone_number": phoneNumber,
            "orange_money_ci_otp": ussd_code,
            "payment_token": invoice_token
        };
        const res = await axios.post(ENV_CONTENTS.PAYDUNYA_CASHOUT_BASE_URL + 'softpay/orange-money-ci', payloads);
        return res.data;
    } catch (error) {
        throw new Error(JSON.stringify(error?.response?.data?? {"msg": error.message}));
    }

}

module.exports = {
    cashOutOmCi
}