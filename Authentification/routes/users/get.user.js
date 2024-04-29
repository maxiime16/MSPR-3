const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = (db) => {
  router.post("/login", (req, res) => {
    const { email, password } = req.body;

    // Recherche de l'utilisateur par email
    db.all(
      "SELECT * FROM Users WHERE email = ?",
      [email],
      async (err, user) => {
        if (err) {
          return res.status(500).json({
            error:
              "Une erreur s'est produite lors de la recherche de l'utilisateur.",
          });
        }

        if (!user) {
          return res.status(404).json({
            error: "Aucun utilisateur trouvé avec cette adresse e-mail.",
          });
        }

        // Vérification du mot de passe
        try {
          const passwordMatch = await bcrypt.compare(password, user.password);

          if (!passwordMatch) {
            return res.status(401).json({ error: "Mot de passe incorrect." });
          }

          // Si le mot de passe est correct, créer un JWT
          const token = jwt.sign(
            {
              id: user.id,
              email: user.email,
              name: user.name,
              last_name: user.last_name,
            },
            "test"
          );

          console.log("Token généré :", token);

          res.set("Authorization", `Bearer ${token}`);

          // Si le mot de passe est correct, retourner les informations de l'utilisateur
          res.status(200).json({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
          });
        } catch (error) {
          console.error("Error comparing passwords:", error);
          return res.status(500).json({
            error:
              "Une erreur s'est produite lors de la vérification du mot de passe.",
          });
        }
      }
    );
  });
  router.get("/:id", (req, res) => {
    const userId = req.params.id;
    console.log(userId);

    // Recherche de l'utilisateur par ID dans la base de données
    db.get(
      "SELECT id, email, first_name AS name, last_name FROM Users WHERE id = ?",
      [userId],
      (err, user) => {
        if (err) {
          return res.status(500).json({
            error:
              "Une erreur s'est produite lors de la recherche de l'utilisateur.",
          });
        }
        if (!user) {
          console.log("pas de user avec cet id");
          return res.status(404).json({
            error: "Aucun utilisateur trouvé avec cet ID.",
          });
        }
        // Si l'utilisateur est trouvé, retournez-le en tant que réponse
        res.status(200).json(user);
      }
    );
  });
  return router;
};
