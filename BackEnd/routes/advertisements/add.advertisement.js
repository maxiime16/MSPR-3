/**
 * Advertisement
 * Create
 *
 * route pour créer une annonce
 */
const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.post("/create", (req, res) => {
    const {
      title,
      description,
      user_id,
      longitude,
      latitude,
      category_id,
      sub_category_id,
      start_date,
      end_date,
      city,
      postal_code,
    } = req.body;
    db.run(
      "INSERT INTO Advertisements (title, description, user_id, longitude, latitude, category_id, sub_category_id, start_date, end_date, city, postal_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        title,
        description,
        user_id,
        longitude,
        latitude,
        category_id,
        sub_category_id,
        start_date,
        end_date,
        city,
        postal_code,
      ],
      function (err) {
        if (err) {
          console.error(err);
          res.status(500).json({
            details: "Erreur simulée lors de l'insertion",
            error: "Erreur lors de l'insertion de l'annonce.",
          });
        } else {
          // Renvoyer l'ID de la nouvelle annonce insérée
          res.json({
            id: this.lastID,
            message: "Annonce insérée avec succès.",
          });
        }
      }
    );
  });
  return router;
};
