/* Imports */
const express = require("express");
const sqlite3 = require("sqlite3");
const cors = require("cors");
const path = require("path");

const fs = require("fs");


const app = express();

// Connexion à la base de données SQLite
const db = new sqlite3.Database("./bdd/auth.db");

//Création de l'application
app.use(
  express.json(),
  cors({
    origin: "http://localhost:5174",
  })
);

// Démarrer le serveur
app.listen(process.env.SERVER_PORT, () => {
  console.log(`Le serveur est en cours d'exécution sur le port ${process.env.SERVER_PORT}`);
});

module.exports = app;

/* Gestion des routes */

// récupérer les fichiers pour les routes
const routeFilesUsers = fs.readdirSync(
  path.join(__dirname, "routes", "users")
);

const routeFilesJWT = fs.readdirSync(
  path.join(__dirname, "routes", "jwt")
);

// Importer chaque fichier et les ajouter à l'application
routeFilesUsers.forEach((file) => {
  if (file.endsWith(".js")) {
    const routePath = `./routes/users/${file}`;
    const route = require(routePath)(db);
    app.use(`/api/users/`, route);
  }
});

routeFilesJWT.forEach((file) => {
  if (file.endsWith(".js")) {
    const routePath = `./routes/jwt/${file}`;
    const route = require(routePath)(db);
    app.use(`/api/jwt/`, route);
  }
});