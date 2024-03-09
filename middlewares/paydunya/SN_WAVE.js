const axios = require('axios');
const ENV_CONTENTS = process.env;

const cashOutWaveSn = async (fullName, phoneNumber, invoice_token) => {
    try {
        var payloads = {
            "wave_senegal_fullName": fullName,
            "wave_senegal_email": "",
            "wave_senegal_phone": phoneNumber,
            "wave_senegal_payment_token": invoice_token
        };
        const res = await axios.post(ENV_CONTENTS.PAYDUNYA_CASHOUT_BASE_URL + 'softpay/wave-senegal', payloads);
        return res.data;
    } catch (error) {
        return null;
    }

}

module.exports = {
    cashOutWaveSn
}