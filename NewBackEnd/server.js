const express = require("express");
const { specs, swaggerUi } = require("./config/swaggerConfig");
const cors = require("cors");
const app = express();
const PORT = 3000;

// Middleware pour analyser les requêtes JSON
app.use(
  express.json(),
  cors({
    origin: "http://localhost:5174",
  })
);

// Middleware pour servir la documentation Swagger
app.use("/api/doc", swaggerUi.serve, swaggerUi.setup(specs));

// Routes pour l'entité "advertisement"
const advertisementRoutes = require("./routes/advertisementRoute");
app.use("/api/advertisement", advertisementRoutes);

// Routes pour l'entité "advice"
const adviceRoutes = require("./routes/adviceRoute");
app.use("/api/advice", adviceRoutes);

// Routes pour l'entité "category"
const categoryRoutes = require("./routes/categoryRoute");
app.use("/api/category", categoryRoutes);

// Routes pour l'entité "sub-category"
const subCategoryRoutes = require("./routes/subCategoryRoute");
app.use("/api/subcategory", subCategoryRoutes);

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
