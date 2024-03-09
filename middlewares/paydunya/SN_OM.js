const axios = require('axios');
const ENV_CONTENTS = process.env;

const cashOutOmSn = async (fullName, phoneNumber, ussd_code, invoice_token) => {
    try {
        var payloads = {
            "customer_name": fullName,
            "customer_email": "",
            "phone_number": phoneNumber,
            "authorization_code": ussd_code,
            "invoice_token": invoice_token
        };
        const res = await axios.post(ENV_CONTENTS.PAYDUNYA_CASHOUT_BASE_URL + 'softpay/orange-money-senegal', payloads);
        return res.data;
    } catch (error) {
        throw new Error(JSON.stringify(error?.response?.data?? {"msg": error.message}));
    }

}

module.exports = {
    cashOutOmSn
}