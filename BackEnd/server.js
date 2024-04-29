/* Imports */
const express = require("express");
const sqlite3 = require("sqlite3");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const app = express();

// Connexion à la base de données SQLite
const db = new sqlite3.Database("./bdd/arosaje.db");

app.use(
  express.json(),
  cors({
    origin: "http://localhost:5173",
  })
);

// Démarrer le serveur
app.listen(process.env.SERVER_PORT, () => {
  console.log(`Le serveur est en cours d'exécution sur le port ${process.env.SERVER_PORT}`);
});

// Exporter l'application pour les tests
module.exports = app;

/* Gestion des routes */
const routeFilesAdvertisement = fs.readdirSync(
  path.join(__dirname, "routes", "advertisements")
);
const routeFilesAdvice = fs.readdirSync(
  path.join(__dirname, "routes", "advices")
);
const routeFilesCategory = fs.readdirSync(
  path.join(__dirname, "routes", "categories")
);
const routeFilesSubCategory = fs.readdirSync(
  path.join(__dirname, "routes", "subCategories")
);
const routeFilesImage = fs.readdirSync(
  path.join(__dirname, "routes", "images")
);

// Importer chaque fichier et les ajouter à l'application
routeFilesAdvertisement.forEach((file) => {
  if (file.endsWith(".js")) {
    const routePath = `./routes/advertisements/${file}`;
    const route = require(routePath)(db);
    // const routeName = path.basename(file, '.js');
    // console.log(`/api/advertisements/${routeName}`)
    app.use(`/api/advertisements`, route);
  }
});
routeFilesAdvice.forEach((file) => {
  if (file.endsWith(".js")) {
    const routePath = `./routes/advices/${file}`;
    const route = require(routePath)(db);
    app.use(`/api/advices`, route);
  }
});
routeFilesCategory.forEach((file) => {
  if (file.endsWith(".js")) {
    const routePath = `./routes/categories/${file}`;
    const route = require(routePath)(db);
    app.use(`/api/categories`, route);
  }
});
routeFilesSubCategory.forEach((file) => {
  if (file.endsWith(".js")) {
    const routePath = `./routes/subCategories/${file}`;
    const route = require(routePath)(db);
    app.use(`/api/subCategories`, route);
  }
});
routeFilesImage.forEach((file) => {
  if (file.endsWith(".js")) {
    const routePath = `./routes/images/${file}`;
    const route = require(routePath)(db);
    app.use(`/api/images`, route);
  }
});
