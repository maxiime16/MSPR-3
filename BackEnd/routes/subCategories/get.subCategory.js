/**
 * Categories
 * Get
 *
 * route pour récupérer toutes les catégories
 */
const express = require("express");
const router = express.Router();

module.exports = (db) => {
  // get all
  router.get("/", (_, res) => {
    db.all("SELECT * FROM sub_category", (err, rows) => {
      if (err) {
        res.status(500).json({
          error: "Erreur lors de la récupération des sous-catégories.",
        });
      } else {
        res.json(rows);
      }
    });
  });

  // get by id
  router.get("/:id", (req, res) => {
    const sub_categId = req.params.id;

    db.get(
      "SELECT * FROM sub_category WHERE id = ?",
      [sub_categId],
      (err, row) => {
        if (err) {
          res
            .status(500)
            .json({
              error: `Erreur lors de la récupération des données`,
            });
        } else {
          if (row) {
            res.json(row);
          } else {
            res
              .status(404)
              .json({error : "Erreur lors de la récupération de l'utilisateur avec l'ID."});
          }
        }
      }
    );
  });

  // get by id category
  router.get("/category/:idCateg", (req, res) => {
    const categoryId = req.params.idCateg;

    db.all(
      "SELECT * FROM sub_category WHERE category_id = ?",
      [categoryId],
      (err, rows) => {
        if (err) {
          res
            .status(500)
            .json(
              `Erreur lors de la récupération des sous-catégories de la catégorie avec l'ID ${categoryId}.`
            );
        } else {
          res.json(rows);
        }
      }
    );
  });

  router.get("/category/:idCateg/sub_category/:id", (req, res) => {
    const categoryId = req.params.idCateg;
    const subCategoryId = req.params.id;

    db.get(
      "SELECT * FROM sub_category WHERE category_id = ? AND id = ?",
      [categoryId, subCategoryId],
      (err, row) => {
        if (err) {
          res
            .status(500)
            .json(
              `Erreur lors de la récupération de la sous-catégorie avec l'ID dans la catégorie avec l'ID .`
            );
        } else {
          if (row) {
            res.json(row);
          } else {
            res
              .status(404)
              .json(
                `Sous-catégorie avec l'ID ${subCategoryId} dans la catégorie avec l'ID ${categoryId} non trouvée.`
              );
          }
        }
      }
    );
  });
  return router;
};
