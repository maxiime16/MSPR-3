const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.delete("/:id", (req, res) => {
    const userId = req.params.id;

    // Suppression de l'utilisateur de la base de données
    db.run("DELETE FROM Users WHERE id = ?", [userId], (err) => {
      if (err) {
        console.error("Error deleting user:", err);
        return res.status(500).json({
          error:
            "Une erreur s'est produite lors de la suppression du compte utilisateur.",
        });
      }

      res
        .status(200)
        .json({ message: "Compte utilisateur supprimé avec succès." });
    });
  });
  return router;
};