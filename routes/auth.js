// routes/auth.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const {createTransport} = require("nodemailer");
const OtpUtils = require('../utils/otpUtils');
const router = express.Router();
const multer = require('multer');
const userController = require('../controllers/userController');

// Configuration de Multer pour stocker les fichiers dans le dossier 'uploads'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    },
});

const upload = multer({ storage: storage });

router.post('/register-with-file',upload.fields([{ name: 'recto', maxCount: 1 }, { name: 'verso', maxCount: 1 }]), userController.registerWithFiles);

// Middleware de validation pour les données d'entrée
const validateRegisterInput = [
    body('email')
        .notEmpty().withMessage('L\'adresse e-mail ne peut pas être vide')
        .isEmail().withMessage('L\'adresse e-mail n\'est pas valide'),
    body('first_name').notEmpty().withMessage('Le prénom ne peut pas être vide'),
    body('last_name').notEmpty().withMessage('Le nom de famille ne peut pas être vide'),
    body('phone_number')
        .notEmpty().withMessage('Le numéro de téléphone ne peut pas être vide')
        .isInt({ min: 100000000, max: 999999999 }).withMessage('Le numéro de téléphone doit être un nombre de 9 chiffres')
        .custom(value => {
            const validPrefixes = ['77', '78', '70'];
            const prefix = value.toString().substring(0, 2);
            if (!validPrefixes.includes(prefix)) {
                throw new Error('Le numéro de téléphone doit commencer par 77, 78 ou 70');
            }
            return true;
        }),
    body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
];



/**
 * @swagger
 * tags:
 *   name: Authentification
 *   description: Gestion de l'authentification et des utilisateurs
 */

// Route pour la création de compte utilisateur
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     tags:
 *       - Utilisateurs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             example:
 *               message: Utilisateur créé avec succès
 *       400:
 *         description: Erreur de validation
 *         content:
 *           application/json:
 *             example:
 *               message: Échec de la validation des données
 *               errors:
 *                 - Champ 'username' requis
 */
router.post('/register', async (req, res) => {

    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
    }

  try {
    const { email, first_name, last_name, phone_number, password,pays_iso_2 } = req.body;

    // Vérifiez si l'utilisateur existe déjà
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ message: 'L\'utilisateur existe déjà' });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);


    //send OTP to User
    // Générer un code OTP
      const otpCode = OtpUtils.generateOTP();
    // Envoyer le code OTP par e-mail
      await OtpUtils.sendOTPEmail(email, otpCode);
      // Création de l'utilisateur
      user = await User.create({ email, first_name, last_name, phone_number,pays_iso_2:pays_iso_2, password: hashedPassword, status:'INIT', otp_code : otpCode });

      res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route pour l'authentification de l'utilisateur
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifiez si l'utilisateur existe
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    // Vérifiez le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    if (user.status !== 'VERIFIED'){
        return res.status(401).json({ message: "ce compte n'est pas encore verifier" });
    }
    // Générer un token JWT
    const token = jwt.sign({ userId: user.id }, 'votre_clé_secrète', { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});




module.exports = router;