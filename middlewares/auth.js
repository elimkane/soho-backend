// middlewares/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assurez-vous d'importer le modèle User

// Middleware pour vérifier si l'utilisateur est authentifié
async function authenticateUser(req, res, next) {
    // Récupérer le jeton d'authentification depuis les en-têtes de la requête
    const token = req.header('Authorization');

    // Vérifier s'il y a un jeton
    if (!token) {
        return res.status(401).json({ message: 'Non authentifié. Aucun jeton fourni.' });
    }

    try {
        // Vérifier et décoder le jeton
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Vérifier si l'utilisateur existe dans la base de données
        const user = await User.findByPk(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: 'Authentification invalide. Utilisateur non trouvé.' });
        }

        // Ajouter l'ID de l'utilisateur décodé à l'objet de demande
        req.user = { id: decoded.userId, email: user.email }; // Vous pouvez ajouter d'autres informations utilisateur si nécessaire

        // Passer à la prochaine étape du middleware
        next();
    } catch (error) {
        console.error(error);
        // Si le token n'est pas valide, retourner une réponse 401
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Authentification invalide. Le jeton a expiré.' });
        }
        res.status(401).json({ message: 'Authentification invalide.' });
    }
}

module.exports = authenticateUser;
