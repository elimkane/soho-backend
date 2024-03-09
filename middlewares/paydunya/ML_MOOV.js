// const axios = require('axios');
// const ENV_CONTENTS = process.env;

// const cashOutMoovMl = async (fullName, phoneNumber, invoice_token) => {
//     try {
//         var payloads = {
//             "moov_ml_customer_fullname": fullName,
//             "moov_ml_email": "",
//             "moov_ml_phone_number": phoneNumber,
//             "moov_ml_customer_address": "",
//             "payment_token": invoice_token
//         };
//         const res = await axios.post(ENV_CONTENTS.PAYDUNYA_CASHOUT_BASE_URL + 'softpay/moov-mali', payloads);
//          //TODO : LOGS
//         return res.data;
//     } catch (error) {
//          //TODO : LOGS
//         return null;
//     }

// }

// module.exports = {
//     cashOutMoovMl
// }