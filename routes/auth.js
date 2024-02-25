// routes/auth.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();


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

// Route pour la création de compte utilisateur
router.post('/register', async (req, res) => {

    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
    }

  try {
    const { email, first_name, last_name, phone_number, password } = req.body;

    // Vérifiez si l'utilisateur existe déjà
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ message: 'L\'utilisateur existe déjà' });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    user = await User.create({ email, first_name, last_name, phone_number, password: hashedPassword, status:'INIT' });
    
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