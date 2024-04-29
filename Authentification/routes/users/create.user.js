const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

module.exports = (db) => {
  router.post("/signup", async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    console.log(req.body);
    console.log(first_name);
    console.log(last_name);
    console.log(email);

    // Vérification si l'utilisateur existe déjà
    db.all("SELECT * FROM Users WHERE email = ?", [email], async (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Une erreur s'est produite." });
      }
      if (rows.length > 0) {
        return res.status(400).json({ error: "Cet email est déjà utilisé." });
      }

      // Hashage du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insertion du nouvel utilisateur dans la base de données
      db.run(
        "INSERT INTO Users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)",
        [first_name, last_name, email, hashedPassword],
        (err) => {
          if (err) {
            console.error("Erreur lors de la création de l'utilisateur:", err);
            return res.status(500).json({
              error: "Une erreur s'est produite lors de la création de l'utilisateur.",
            });
          }
          res.status(201).json({ message: "Utilisateur créé avec succès." });
        }
      );
    });
  });

  return router;
};

