const axios = require('axios');
const ENV_CONTENTS = process.env;

const cashOutWaveCi = async (fullName, phoneNumber, invoice_token) => {
    try {
        var payloads = {
            "wave_ci_fullName": fullName,
            "wave_ci_email": "",
            "wave_ci_phone": phoneNumber,
            "wave_ci_payment_token": invoice_token
        };
        const res = await axios.post(ENV_CONTENTS.PAYDUNYA_CASHOUT_BASE_URL + 'softpay/wave-ci', payloads);
        return res.data;
    } catch (error) {
        return null;
    }

}

module.exports = {
    cashOutWaveCi
}