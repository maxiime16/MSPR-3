// server.js
const express = require("express");
const { specs, swaggerUi } = require("./config/swaggerConfig");
const cors = require("cors");
const app = express();
const PORT = 3001;

// Middleware pour analyser les requêtes JSON
app.use(
  express.json(),
  cors({
    origin: "http://localhost:5174",
  })
);

// Middleware pour servir la documentation Swagger
app.use("/api/doc", swaggerUi.serve, swaggerUi.setup(specs));

// Routes pour l'entité "user"
const userRoutes = require("./routes/userRoute");
app.use("/api/user", userRoutes);

// Routes pour l'entité "jwt"
const jwtRoutes = require("./routes/jwtRoute");
app.use("/api/jwt", jwtRoutes);

// Gestion des erreurs de syntaxe JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Bad JSON');
    return res.status(400).send({ error: 'Bad JSON' }); // envoyer une réponse 400
  }
  next(err); // passer à l'autre middleware d'erreurs si ce n'est pas une erreur de syntaxe
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

// Laissez cette route pour gérer les autres types de requêtes ou les erreurs 404
app.use((req, res) => {
  res.status(404).send("Page not found");
});

// Exporter l'application pour les tests
module.exports = app;

// Démarrer le serveur
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
