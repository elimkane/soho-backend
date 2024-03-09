const axios = require('axios');
const ENV_CONTENTS = process.env;

const cashOutOmMl = async (fullName, phoneNumber, ussd_code,  invoice_token) => {
    try {
        var payloads = {
            "orange_money_mali_customer_fullname": fullName,
            "orange_money_mali_email": "",
            "orange_money_mali_phone_number": phoneNumber,
            "orange_money_mali_customer_address": "",
            "orange_money_mali_wallet_otp": ussd_code,
            "payment_token": invoice_token
        };
        const res = await axios.post(ENV_CONTENTS.PAYDUNYA_CASHOUT_BASE_URL + 'softpay/orange-money-mali', payloads);
        return res.data;
    } catch (error) {
        throw new Error(JSON.stringify(error?.response?.data?? {"msg": error.message}));
    }

}

module.exports = {
    cashOutOmMl
}