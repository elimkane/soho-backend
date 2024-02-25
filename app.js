// app.js

const express = require('express');
const swagger = require('./swagger'); // Chemin vers votre fichier swagger.js
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transaction');
const sequelize = require('./storage/sequelize-config');

const app = express();
const port = 3000;

app.use(bodyParser.json());

//endpoint authentification
app.use('/auth', authRoutes);
//endpoint transaction
app.use('/transaction', transactionRoutes);
// Ajoutez Swagger à votre application
app.use('/api-docs', swagger.serve, swagger.setup);

sequelize.sync({force : true}).then(() => {
  app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur le port ${port}`);
  });
}).catch((error) => {
  console.error('Erreur de synchronisation avec la base de données:', error);
});
