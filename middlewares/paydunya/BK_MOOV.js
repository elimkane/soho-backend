const axios = require('axios');
const ENV_CONTENTS = process.env;

const cashOutMoovBk = async (fullName, phoneNumber, invoice_token) => {
    try {
        var payloads = {
            "moov_burkina_faso_fullName": fullName,
            "moov_burkina_faso_email": "",
            "moov_burkina_faso_phone_number": phoneNumber,
            "moov_burkina_faso_payment_token": invoice_token
        };
        const res = await axios.post(ENV_CONTENTS.PAYDUNYA_CASHOUT_BASE_URL + 'softpay/moov-burkina', payloads);
         //TODO : LOGS
        return res.data;
    } catch (error) {
         //TODO : LOGS
        return null;
    }
}

module.exports = {
    cashOutMoovBk
}