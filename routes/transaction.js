// routes/transactions.js

const express = require('express');
const { body, validationResult } = require('express-validator');
const Transaction = require('../models/Transaction');
//const authMiddleware = require('../middlewares/auth');
const transactionController = require('../controllers/transaction');

const router = express.Router();

// Middleware pour s'assurer que l'utilisateur est authentifié
//router.use(authMiddleware);

// Middleware de validation pour les données d'entrée
const validateTransactionInput = [
    body('amount').isNumeric().withMessage('Le montant doit être un nombre positif'),
    body('recipientEmail').isEmail().withMessage('L\'adresse e-mail du destinataire n\'est pas valide'),
];

// Endpoint pour créer une transaction
router.post('/create-transaction', transactionController.doTransfert);


// Endpoint pour récupérer une transaction par ID
router.get('/get-transaction-old/:transactionId', async (req, res) => {
    try {
        const transactionId = req.params.transactionId;

        // Récupérer la transaction par ID
        const transaction = await Transaction.findByPk(transactionId);

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction non trouvée' });
        }

        res.status(200).json({ transaction });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération de la transaction' });
    }
});


// Endpoint pour lister les transactions d'un utilisateur
router.get('/list-transactions', async (req, res) => {
    try {
        const userId = req.user.id; // L'ID de l'utilisateur authentifié

        // Récupérer toutes les transactions de l'utilisateur
        const transactions = await Transaction.findAll({ where: { senderId: userId } });

        res.status(200).json({ transactions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des transactions' });
    }
});

router.get('/list-services',transactionController.getAllService);
module.exports = router;
