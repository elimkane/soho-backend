const axios = require('axios');
const ENV_CONTENTS = process.env;

const cashOutWizallSn = async (fullName, phoneNumber, invoice_token) => {
    try {
        var payloads = {
            "customer_name": fullName,
            "customer_email": "",
            "phone_number": phoneNumber,
            "invoice_token": invoice_token
        };
        const res = await axios.post(ENV_CONTENTS.PAYDUNYA_CASHOUT_BASE_URL + 'softpay/wizall-money-senegal', payloads);
        return res.data;
    } catch (error) {
        return null;
    }

}

module.exports = {
    cashOutWizallSn
}