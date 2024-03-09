const axios = require('axios');
const ENV_CONTENTS = process.env;

const cashOutEmoneySn = async (fullName, phoneNumber, invoice_token) => {
    try {
        var payloads = {
            "expresso_sn_fullName": fullName,
            "expresso_sn_email": "",
            "expresso_sn_phone": phoneNumber,
            "payment_token": invoice_token
        };
        const res = await axios.post(ENV_CONTENTS.PAYDUNYA_CASHOUT_BASE_URL + 'softpay/expresso-senegal', payloads);
    } catch (error) {
        throw new Error(JSON.stringify(error?.response?.data?? {"msg": error.message}));
    }

}

module.exports = {
    cashOutEmoneySn
}