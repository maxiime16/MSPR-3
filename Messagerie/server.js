const { specs, swaggerUi } = require("./config/swaggerConfig.js");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.SERVER_PORT;
let connectedUsers = 0;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5174", "http://localhost:3000"],
    methods: ["GET", "POST"]
  }
});

// Middleware pour analyser les requêtes JSON
app.use(
  express.json(),
  cors({
    origin: "http://localhost:5174",
  })
);

// Middleware pour servir la documentation Swagger
app.use("/api/doc", swaggerUi.serve, swaggerUi.setup(specs));

// Routes pour l'entité "conversation"
const conversationRoutes = require("./routes/conversationRoute");
app.use("/api/conversation", conversationRoutes);

// Routes pour l'entité "message"
const messageRoutes = require("./routes/messageRoute");
app.use("/api/message", messageRoutes);

// Routes pour l'entité "participant"
const participantRoutes = require("./routes/participantRoute");
app.use("/api/participant", participantRoutes);

// Route pour tester la gestion globale des erreurs
app.get("/error", (req, res, next) => {
  next(new Error("Test Error"));
});

// Gestion des erreurs de syntaxe JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error("Bad JSON");
    return res.status(400).send({ error: "Bad JSON" }); // envoyer une réponse 400
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

io.on("connection", (socket) => {
  connectedUsers++;
  console.log(`Un client s'est connecté. Nombre actuel: ${connectedUsers}`);
  io.emit('usersCount', { count: connectedUsers });

  socket.on("disconnect", () => {
    connectedUsers--;
    console.log(`Un client s'est déconnecté. Nombre actuel: ${connectedUsers}`);
    io.emit('usersCount', { count: connectedUsers });
  });
});


// Démarrer le serveur uniquement si ce fichier est exécuté directement
if (require.main === module) {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
