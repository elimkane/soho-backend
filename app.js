// app.js

const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const sequelize = require('./storage/sequelize-config');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use('/auth', authRoutes);

sequelize.sync({force : true}).then(() => {
  app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur le port ${port}`);
  });
}).catch((error) => {
  console.error('Erreur de synchronisation avec la base de données:', error);
});
