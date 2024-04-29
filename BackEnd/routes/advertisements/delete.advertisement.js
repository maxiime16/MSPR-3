/**
 * Advertisement
 * Delete
 *
 * route pour supprimer une annonce
 */
const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.delete("/:id", (req, res) => {
    const advertisementId = req.params.id;
    db.run(
      "DELETE FROM advertisements WHERE id = ?",
      [advertisementId],
      (err) => {
        if (err) {
          console.error(err);
          res
            .status(500)
            .json(
              `Erreur lors de la suppression de l'annonce avec l'ID ${advertisementId}.`
            );
        } else {
          res
            .status(200)
            .json(
              `Annonce avec l'ID ${advertisementId} supprimée avec succès.`
            );
        }
      }
    );
  });

  return router;
};
