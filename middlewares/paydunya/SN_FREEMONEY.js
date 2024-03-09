const axios = require('axios');
const ENV_CONTENTS = process.env;

const cashOutFmSn = async (fullName, phoneNumber, invoice_token) => {
    try {
        var payloads = {
            "customer_name": fullName,
            "customer_email": "",
            "phone_number": phoneNumber,
            "payment_token": invoice_token
        };
        const res = await axios.post(ENV_CONTENTS.PAYDUNYA_CASHOUT_BASE_URL + 'softpay/free-money-senegal', payloads);
        return res.data;
    } catch (error) {
        throw new Error(JSON.stringify(error?.response?.data?? {"msg": error.message}));
    }

}

module.exports = {
    cashOutFmSn
}