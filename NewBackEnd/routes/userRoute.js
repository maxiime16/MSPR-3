const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtient un utilisateur par son identifiant.
 *     description: Récupère les détails d'un utilisateur spécifique en utilisant son identifiant.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: L'identifiant de l'utilisateur à récupérer.
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Succès, renvoie les détails de l'utilisateur demandé.
 *       '404':
 *         description: Utilisateur non trouvé.
 *       '500':
 *         description: Erreur du serveur.
 */
router.get("/:id", userController.getUserById);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtient tous les utilisateurs.
 *     description: Récupère la liste de tous les utilisateurs enregistrés dans le système.
 *     responses:
 *       '200':
 *         description: Succès, renvoie la liste de tous les utilisateurs.
 *       '500':
 *         description: Erreur du serveur.
 */
router.get("/", userController.getAllUsers);

module.exports = router;
