// controllers/transaction.js

const User = require("../models/Transaction");

const axios = require('axios');

//function to registrer user with a files uploaded
async function doTransfert(req, res) {
  try {
    const { source, destination, amount } = req.body;
    // Construisez l'URL complète du fichier

    console.log(source?.id_user);
    console.log(destination);
    let user = await User.findByPk(source?.id_user);
    if (user){
      //consommer api paydundya pour depot
      //1- generation invoice
   const token =    generateInvoice(source?.operator,amount);
      res.status(200).json({ message: "Token invoice cree" });

    }else{
      res.status(404).json({ message: "Utilisateur non trouvée" });

    }
    return true;
    /*// Vérifiez si l'utilisateur existe déjà
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ message: "L'utilisateur existe déjà" });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    const otpCode = OtpUtils.generateOTP();
    // Envoyer le code OTP par e-mail
    await OtpUtils.sendOTPEmail(email, otpCode);

    const baseUrl = "http://localhost:3000"; // Remplacez cela par l'URL de votre serveur
    const rectoUrl = baseUrl + "/" + rectoFile.path;
    const versoUrl = baseUrl + "/" + versoFile.path;

    // Enregistrez les chemins des fichiers dans la base de données
    user = await User.create({
      email,
      first_name,
      last_name,
      phone_number,
      password: hashedPassword,
      status: "INIT",
      otp_code: otpCode,
      recto: rectoUrl,
      verso: versoUrl,
    });

    // Retournez l'URL complète dans la réponse JSON
    res.status(201).json({
      message: "Utilisateur créé avec succès",
      rectoUrl: rectoUrl,
      versoUrl: versoUrl,
    });*/
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

//function that send otp to client

async function generateInvoice(operator_source,amount){
  const name = "Depot "+operator_source;
  let data = JSON.stringify({
    "invoice": {
      "item_0": {
        "name": name.toString(),
        "quantity": 1,
        "unit_price": amount,
        "total_price": amount,
        "description": name.toString()
      },
      "taxes": {},
      "total_amount": amount,
      "description": ""
    },
    "store": {
      "name": "MyPay",
      "tagline": "",
      "postal_address": "",
      "phone": "",
      "logo_url": "",
      "website_url": ""
    },
    "custom_data": {},
    "actions": {
      "callback_url": "http://localhost:3000/hello"
    }
  });
console.log(data);
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://app.paydunya.com/api/v1/checkout-invoice/create',
    headers: {
      'PAYDUNYA-MASTER-KEY': 'JcOU73pG-NVJm-OYZ0-9hoT-21ZIaeqHdvtc',
      'PAYDUNYA-PRIVATE-KEY': 'live_private_H104hiqMEhG9ULjI4G63wcQpPGg',
      'PAYDUNYA-TOKEN': 'LnfLi1GUW9NSGEDIAIRG',
      'Content-Type': 'application/json'
    },
    data : data
  };

 await axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
}



module.exports = {
  doTransfert,

};
