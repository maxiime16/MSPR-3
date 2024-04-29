/**
 * Images
 * Delete
 *
 * route pour supprimer une image
 */
const express = require("express");
const router = express.Router();
const fs = require("fs");

module.exports = (db) => {
  router.delete("/:imageId", (req, res) => {
    const imageId = req.params.imageId;

    // Récupérer le chemin de l'image à partir de la base de données
    db.get("SELECT image FROM images WHERE id = ?", [imageId], (err, row) => {
      if (err) {
        console.error(err);
        res
          .status(500)
          .json("Erreur lors de la récupération du chemin de l'image.");
      } else {
        if (row) {
          const imagePath = row.image;
          // Supprimer le fichier d'image du système de fichiers
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.error(err);
              res.status(500).json("Erreur lors de la suppression de l'image.");
            } else {
              // Supprimer l'entrée de l'image de la base de données
              db.run("DELETE FROM images WHERE id = ?", [imageId], (err) => {
                if (err) {
                  console.error(err);
                  res
                    .status(500)
                    .json(
                      "Erreur lors de la suppression de l'entrée de l'image de la base de données."
                    );
                } else {
                  res.status(200).json("Image supprimée avec succès.");
                }
              });
            }
          });
        } else {
          res.status(404).json(`Image avec l'ID ${imageId} non trouvée.`);
        }
      }
    });
  });

  return router;
};
