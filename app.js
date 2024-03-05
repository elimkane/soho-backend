// app.js
require('dotenv').config();
const express = require('express');
const swagger = require('./swagger'); // Chemin vers votre fichier swagger.js
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transaction');
const sequelize = require('./storage/sequelize-config');
const path = require('path');


const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configurez express pour servir les fichiers statiques depuis le répertoire 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//endpoint authentification
app.use('/auth', authRoutes);
//endpoint transaction
app.use('/transaction', transactionRoutes);
// Ajoutez Swagger à votre application
app.use('/api-docs', swagger.serve, swagger.setup);
console.log('databaseName ',process.env.DATABASE_NAME);
sequelize.sync({force : true}).then(() => {
//sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur le port ${port}`);
  });
}).catch((error) => {
  console.error('Erreur de synchronisation avec la base de données:', error);
});
