const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

module.exports = (db) => {
  //////////////////////
  // Vérification JWT //
  //////////////////////

  router.post("/verifyToken", (req, res) => {
    const token = req.headers.authorization; // Récupère le token JWT depuis le header
    console.log("token", token)
  
    // Vérifie si le token est présent dans le header
    if (!token) {
      return res.status(401).json({ error: "Token JWT non fourni." });
    }
  
    try {
      // Vérifie la validité du token
      const decoded = jwt.verify(token.split(" ")[1], "test"); // Décode le token JWT en utilisant la même clé secrète que celle utilisée pour le signer
      console.log("test du jwt")
      // Si le token est valide, renvoie une réponse 200 OK
      res.status(200).json({ message: "Token JWT valide." });
    } catch (error) {
      console.error("Erreur lors de la vérification du token JWT :", error);
      // Si le token est invalide, renvoie une réponse 401 Unauthorized
      res.status(401).json({ error: "Token JWT invalide." });
    }
  });
  return router;
};
