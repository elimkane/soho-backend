const axios = require('axios');
const ENV_CONTENTS = process.env;

const cashOutMoovBn = async (fullName, phoneNumber, invoice_token) => {
    try {
        var payloads = {
            "moov_benin_customer_fullname": fullName,
            "moov_benin_email": "",
            "moov_benin_phone_number": phoneNumber,
            "payment_token": invoice_token
        };
        const res = await axios.post(ENV_CONTENTS.PAYDUNYA_CASHOUT_BASE_URL + 'softpay/moov-benin', payloads);
         //TODO : LOGS
        return res.data;
    } catch (error) {
         //TODO : LOGS
        return null;
    }

}

module.exports = {
    cashOutMoovBn
}