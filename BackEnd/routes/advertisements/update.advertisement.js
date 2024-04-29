/**
 * Advertisement
 * Update
 *
 * route pour modifier une annonce
 */
const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.put("/:id/update", (req, res) => {
    const advertisementsId = req.params.id;
    const { title, description, user_id, plants_id, location } = req.body;
    db.run(
      "UPDATE advertisements SET title = ?, description = ?, user_id = ?, plants_id = ?, location = ? WHERE id = ?",
      [title, description, user_id, plants_id, location, advertisementsId],
      (err) => {
        if (err) {
          console.error(err);
          res
            .status(500)
            .json(
              `Erreur lors de la mise à jour de la plante avec l'ID ${advertisementsId}.`
            );
        } else {
          res
            .status(200)
            .json(
              `Plante avec l'ID ${advertisementsId} mise à jour avec succès.`
            );
        }
      }
    );
  });
  return router;
};
