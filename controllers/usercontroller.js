// controllers/userController.js

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const OtpUtils = require("../utils/otpUtils");
const Otp = require("../models/Otp");

async function uploadFileForUser(req, res) {
  try {
    const rectoFile = req.files["recto"][0];
    const versoFile = req.files["verso"][0];
    const { id } = req.body;

    const user = await User.findByPk(id);
    //user.dataValues.recto = rectoFile;
    if (!user) {
      return res.status(400).json({ message: "Utilisateur n'existe pas" });
    }

    const baseUrl = "http://localhost:3000"; // Remplacez cela par l'URL de votre serveur
    const rectoUrl = baseUrl + "/" + rectoFile.path;
    const versoUrl = baseUrl + "/" + versoFile.path;

    // Mettez à jour les champs recto et verso dans la base de données
    user.recto = rectoUrl;
    user.verso = versoUrl;
    await user.save();

    res.status(200).json({
      message: "Fichiers téléchargés avec succès",
      rectoUrl: rectoUrl,
      versoUrl: versoUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

async function registerWithFiles(req, res) {
  try {
    const { email, first_name, last_name, phone_number, password } = req.body;
    // Construisez l'URL complète du fichier

    const rectoFile = req.files["recto"][0];
    const versoFile = req.files["verso"][0];

    // Vérifiez si l'utilisateur existe déjà
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
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}

async function sendOtp(req, res) {
  try {
    //get email from input json
    const { email } = req.body;
    //check if user exist
    const user = await checkUserByEmail(email);
    if (user) {
      //generate otp
      const otpCode = OtpUtils.generateOTP();
      //saveOtp to database
      console.log("user_id", user.id);
      await Otp.create({
        otp_code: otpCode,
        userId: user.id,
        canal: "email",
        status: "V",
      });
      user.otpCode = otpCode;
      await user.save();
      //send Otp to user
      await OtpUtils.sendOTPEmail(email, otpCode);

      res.status(200).json({
        message: "code Otp envoyé avec succés",
      });
    }else{ //user not found
      res.status(404).json({message : 'utilisateur non trouvé'});
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Erreur serveur ", e });
  }
}

async function checkUserByEmail(email) {
  // Vérifiez si l'utilisateur existe déjà
  let user = await User.findOne({ where: { email } });
  if (user) {
    return user;
  } else {
    return false;
  }
}

module.exports = {
  registerWithFiles,
  uploadFileForUser,
  sendOtp,
};
