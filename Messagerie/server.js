// src/server.js

const express = require('express');
const bodyParser = require('body-parser');
const messageRoutes = require('./routes/messageRoutes');

const app = express();
const port = 3002;

app.use(bodyParser.json());

// Routes pour les fonctionnalités de messagerie
app.use('/api', messageRoutes);

app.listen(port, () => {
  console.log(`Le serveur est démarré sur le port ${port}`);
});