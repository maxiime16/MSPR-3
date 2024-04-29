/**
 * Advertisement
 * Get
 *
 * route pour récupérer des informations
 */
const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // get by id
  router.get("/:id", (req, res) => {
    const advertisementsId = req.params.id;
    db.get(
      "SELECT * FROM Advertisements WHERE id = ?",
      [advertisementsId],
      (err, row) => {
        if (err) {
          return res
            .status(500)
            .json(
              "Une erreur s'est produite lors de la récupération des annonces par id."
            );
        }
        if (!row) {
          return res.status(404).json({
            error: `Utilisateur avec l'ID ${advertisementsId} non trouvé.`,
          });
        }
        res.json(row);
      }
    );
  });

  // get by id category
  router.get("/category/:categoryId", (req, res) => {
    const categoryId = req.params.categoryId;
    db.all(
      `SELECT * FROM Advertisements WHERE category_id = ?;`,
      [categoryId],
      (err, rows) => {
        if (err) {
          console.error(err);
          res.status(500).json({
            error:
              "Une erreur s'est produite lors de la récupération des annonces par id.",
          });
        } else {
          res.json(rows);
        }
      }
    );
  });

  // get all
  router.get("/", (_, res) => {
    db.all("SELECT * FROM advertisements", (err, rows) => {
      if (err) {
        console.error(err);
        res
          .status(500)
          .json(
            "Une erreur s'est produite lors de la récupération des annonces."
          );
      } else {
        res.json(rows);
      }
    });
  });

  router.get("/user/:userId", (req, res) => {
    const userId = req.params.userId;
    db.all(
      `SELECT * FROM Advertisements WHERE user_id = ?;`,
      [userId],
      (err, rows) => {
        if (err) {
          console.error(err);
          res.status(500).json({
            error:
              "Une erreur s'est produite lors de la récupération des annonces par user_id.",
          });
        } else {
          res.json(rows);
        }
      }
    );
  });


  return router;
};
