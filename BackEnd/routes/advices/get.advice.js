/**
 * Advices
 * Get
 *
 * route pour récupérer des informations
 */
const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // get by id advertisement
  router.get("/advertisement/:id", (req, res) => {
    const advertisementId = req.params.id;
    db.all(
      "SELECT Advice.*, Users.first_name, Users.last_name FROM Advice INNER JOIN Users ON Advice.user_id = Users.id WHERE Advice.advertisement_id = ?",
      [advertisementId],
      (err, rows) => {
        if (err) {
          res.status(500).json(`Erreur lors de la récupération des conseils.`);
        } else {
          res.status(200).json(rows);
        }
      }
    );
  });

  // get all
  router.get("/", (_, res) => {
    db.all("SELECT * FROM advice", (err, rows) => {
      if (err) {
        console.error(err);
        res
          .status(500)
          .json({ error: "Erreur lors de la récupération des conseils." });
      } else {
        res.json(rows);
      }
    });
  });

  // get by id
  router.get("/:id", (req, res) => {
    const adviceId = req.params.id;

    db.get("SELECT * FROM advice WHERE id = ?", [adviceId], (err, row) => {
      if (err) {
        console.error(err);
        res.status(500).json({
          error:
            "Une erreur s'est produite lors de la récupération des annonces par id.",
        });
      } else {
        if (row) {
          res.json(row);
        } else {
          res.status(404).json(`Plante avec l'ID ${adviceId} non trouvée.`);
        }
      }
    });
  });
  return router;
};
