// app.js
require('dotenv').config();
const express = require('express');
const swagger = require('./swagger'); // Chemin vers votre fichier swagger.js
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transaction');
const sequelize = require('./storage/sequelize-config');
const path = require('path');
const sohoTransactionRoute = require('./routes/sohoTransactionRoute');
const cors = require('cors');


const app = express();
//const port = 3000;
const port = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Configuration CORS pour autoriser toutes les origines
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: true,
  optionsSuccessStatus: 204,
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true,
  maxAge: 86400, // 1 day
};
app.use(cors(corsOptions));
// Configurez express pour servir les fichiers statiques depuis le répertoire 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//endpoint authentification
app.use('/auth', authRoutes);
//endpoint transaction
app.use('/transaction', transactionRoutes);
app.use('/transaction', sohoTransactionRoute);


// Ajoutez Swagger à votre application
app.use('/api-docs', swagger.serve, swagger.setup);
console.log('databaseName ',process.env.DATABASE_NAME);
// force : true,
//sequelize.sync({ alter: true}).then(() => {
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur le port ${port}`);
  });
}).catch((error) => {
  console.error('Erreur de synchronisation avec la base de données:', error);
});
