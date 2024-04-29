/**
 * Advices
 * Create
 *
 * route pour créer un conseil
 * 
 * AJOUTER UN SCHEMA
 */
const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.post("/create", (req, res) => {
    const { advertisement_id, user_id, advice } = req.body;

    if (!advertisement_id || !user_id || !advice) {
      return res
        .status(400)
        .json({ message: "Toutes les données sont requises" });
    }

    const insertQuery = `
          INSERT INTO Advice (advertisement_id, user_id, advice)
          VALUES (?, ?, ?)
        `;
    db.run(insertQuery, [advertisement_id, user_id, advice], (err) => {
      if (err) {
        console.error("Erreur lors de l'ajout du conseil :", err);
        res.status(500).json({ message: "Erreur lors de l'ajout du conseil" });
      } else {
        res.status(201).json({ message: "Conseil ajouté avec succès" });
      }
    });
  });
  return router;
};
