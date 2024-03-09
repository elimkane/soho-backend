const axios = require('axios');
const ENV_CONTENTS = process.env;

const paydunyaCashIn = async (disburse_invoice, disburse_id) => {
    try {
        var payloads = {
            "disburse_invoice": disburse_invoice,
            "disburse_id": disburse_id ?? ""
        };
        const res = await axios.post(ENV_CONTENTS.PAYDUNYA_CASHIN_BASE_URL + 'disburse/submit-invoice', payloads);
        return res.data;
    } catch (error) {
        throw new Error(JSON.stringify(error?.response?.data?? {"msg": error.message}));
    }

}

module.exports = {
    paydunyaCashIn
}