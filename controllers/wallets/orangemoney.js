const axios = require('axios');


/**
 * fonction pour effectuer une operation de retrait d'un wallet OM vers le compte paydunya
 * @param user
 * @param authorization_code
 * @param token
 * @returns {Promise<T|T|any>}
 */
async function cashout(user, authorization_code, token) {
    try {
        const customer_name = user.first_name + ' ' + user.last_name;
        let data = JSON.stringify({
            "customer_name": customer_name,
            "customer_email": user.email,
            "phone_number": user.phone_number,
            "authorization_code": authorization_code,
            "invoice_token": token
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://app.paydunya.com/api/v1/softpay/orange-money-senegal',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        const response = await axios.request(config);

        // Accéder au corps JSON de la réponse
        return response.data;
    } catch (error) {
        //console.error('Erreur lors de la requête OM :', error);

        // Si c'est une erreur axios avec une réponse, retournez le corps JSON de la réponse
        if (error.response && error.response.data) {
            return error.response.data;
        }

        // throw error; // Vous pouvez choisir de lancer à nouveau l'erreur ou de retourner une valeur par défaut, selon vos besoins.
    }
}

/**
 * fonction paydunya pour effectuer le depot sur un wallet orangemoney
 * @param token
 * @returns {Promise<*|T|T>}
 */
async function cashin(token) {
    try {
        let data = JSON.stringify({
            "disburse_invoice": token
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://app.paydunya.com/api/v2/disburse/submit-invoice',
            headers: {
                'PAYDUNYA-MASTER-KEY': 'JcOU73pG-NVJm-OYZ0-9hoT-21ZIaeqHdvtc',
                'PAYDUNYA-PRIVATE-KEY': 'live_private_H104hiqMEhG9ULjI4G63wcQpPGg',
                'PAYDUNYA-TOKEN': 'LnfLi1GUW9NSGEDIAIRG',
                'Content-Type': 'application/json'
            },
            data: data
        };
        console.log(data);
        const response = await axios.request(config);
        //console.log(response.data);
        // Accéder au corps JSON de la réponse
        return response.data;
    } catch (error) {
        //console.log(error);
        if (error.response && error.response.data) {
            return error.response.data;
        } else {
            return error;
        }
    }


}

module.exports = {
    cashout,
    cashin
};
