const express = require("express");
const router = express.Router();

module.exports = (db) => {

  router.put("/:id", async (req, res) => {
    const userId = req.params.id;
    const userData = req.body;
  
    try {
      // Vérifier si l'utilisateur existe dans la base de données
      const userExists = await new Promise((resolve, reject) => {
        db.get("SELECT * FROM Users WHERE id = ?", [userId], (err, user) => {
          if (err) {
            reject(err);
          } else {
            resolve(user);
          }
        });
      });
  
      if (!userExists) {
        return res.status(404).json({ error: "Utilisateur non trouvé." });
      }
  
      // Mettre à jour les informations de l'utilisateur
      await new Promise((resolve, reject) => {
        db.run(
          "UPDATE Users SET email = ?, first_name = ?, last_name = ? WHERE id = ?",
          [userData.email, userData.first_name, userData.last_name, userId],
          (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          }
        );
      });
  
      // Récupérer les informations mises à jour de l'utilisateur
      const updatedUser = await new Promise((resolve, reject) => {
        db.get(
          "SELECT id, email, first_name AS name, last_name FROM Users WHERE id = ?",
          [userId],
          (err, user) => {
            if (err) {
              reject(err);
            } else {
              resolve(user);
            }
          }
        );
      });
  
      // Retourner les informations mises à jour de l'utilisateur
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des informations de l'utilisateur :", error);
      res.status(500).json({ error: "Erreur lors de la mise à jour des informations de l'utilisateur." });
    }
  });
  
  return router;
};