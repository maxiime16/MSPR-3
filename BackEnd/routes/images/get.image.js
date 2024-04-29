/**
 * Images
 * Get
 *
 * route pour récupérer des informations
 */
const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // Get all
  router.get("/all/:advertisementId", (req, res) => {
    const advertisementId = req.params.advertisementId;

    db.all(
      "SELECT id, image FROM images WHERE advertisement_id = ?",
      [advertisementId],
      (err, rows) => {
        if (err) {
          console.error(err);
          res.status(500).json("Erreur lors de la récupération des images.");
        } else {
          if (rows.length > 0) {
            // Envoyer les données de toutes les images en tant que réponse
            res.json(rows);
          } else {
            res
              .status(404)
              .json(
                `Aucune image trouvée pour l'annonce avec l'ID ${advertisementId}.`
              );
          }
        }
      }
    );
  });

  // get first img
  router.get("/:advertisementId", (req, res) => {
    const advertisementId = req.params.advertisementId;

    db.get(
      "SELECT id, image FROM images WHERE advertisement_id = ? LIMIT 1",
      [advertisementId],
      (err, row) => {
        if (err) {
          console.error(err);
          res.status(500).json("Erreur lors de la récupération de l'image.");
        } else {
          if (row) {
            // Envoyer les données de l'image en tant que réponse
            res.json(row);
          } else {
            res
              .status(404)
              .json(
                `Aucune image trouvée pour l'annonce avec l'ID ${advertisementId}.`
              );
          }
        }
      }
    );
  });
  return router;
};
