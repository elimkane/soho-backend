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
        return res.data;
    } catch (error) {
        throw new Error(JSON.stringify(error?.response?.data?? {"msg": error.message}));
    }
}

module.exports = {
    cashOutMoovBk
}