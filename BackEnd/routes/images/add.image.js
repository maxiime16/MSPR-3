/**
 * Images
 * Create
 *
 * route pour ajouter une image
 */
const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.post("/upload/:advertisementId", (req, res) => {
    const advertisementId = req.params.advertisementId;
  
    // Récupérer les données de l'image à partir du corps de la requête
    const { image } = req.body;
  
    try {
      // Insérer les données de l'image dans la base de données
      db.run("INSERT INTO images (advertisement_id, image) VALUES (?, ?)", [advertisementId, image], function(err) {
        if (err) {
          console.error(err);
          res.status(500).json("Erreur lors de l'insertion de l'image dans la base de données.");
        } else {
          res.status(201).json("Image ajoutée avec succès.");
        }
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'image :", error);
      res.status(500).json("Erreur lors de l'enregistrement de l'image.");
    }
  });
  return router;
};
