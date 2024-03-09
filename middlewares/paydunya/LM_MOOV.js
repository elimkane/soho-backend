const axios = require('axios');
const ENV_CONTENTS = process.env;

const cashOutMoovMl = async (fullName, phoneNumber, invoice_token) => {
    try {
        var payloads = {
            "moov_ml_customer_fullname": fullName,
            "moov_ml_email": "",
            "moov_ml_phone_number": phoneNumber,
            "moov_ml_customer_address": "",
            "payment_token": invoice_token
        };
        const res = await axios.post(ENV_CONTENTS.PAYDUNYA_CASHOUT_BASE_URL + 'softpay/moov-mali', payloads);
        return res.data;
    } catch (error) {
        throw new Error(JSON.stringify(error?.response?.data?? {"msg": error.message}));
    }

}

module.exports = {
    cashOutMoovMl
}