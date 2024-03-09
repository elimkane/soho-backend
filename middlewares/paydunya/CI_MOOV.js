const axios = require('axios');
const ENV_CONTENTS = process.env;

const cashOutMoovCi = async (fullName, phoneNumber, invoice_token) => {
    try {
        var payloads = {
            "moov_ci_customer_fullname": fullName,
            "moov_ci_email": "",
            "moov_ci_phone_number": phoneNumber,
            "payment_token": invoice_token
        };
        const res = await axios.post(ENV_CONTENTS.PAYDUNYA_CASHOUT_BASE_URL + 'softpay/moov-ci', payloads);
        return res.data;
    } catch (error) {
        throw new Error(JSON.stringify(error?.response?.data?? {"msg": error.message}));
    }

}

module.exports = {
    cashOutMoovCi
}