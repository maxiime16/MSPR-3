const express = require("express");
const router = express.Router();
const advertisementController = require("../controllers/advertisementController");

/**
 * @swagger
 * tags:
 *   name: Advertisement
 *   description: Operations related to advertisements
 * definitions:
 *   Advertisement:
 *     type: "object"
 *     properties:
 *       id:
 *         type: "integer"
 *       title:
 *         type: "string"
 *       description:
 *         type: "string"
 *       longitude:
 *         type: "number"
 *       latitude:
 *         type: "number"
 *       start_date:
 *         type: "string"
 *         format: "date-time"
 *       end_date:
 *         type: "string"
 *         format: "date-time"
 *       city:
 *         type: "string"
 *       postal_code:
 *         type: "integer"
 *       user_id:
 *         type: "integer"
 *       category_id:
 *         type: "integer"
 *       sub_category_id:
 *         type: "integer"
 *     required:
 *       - "title"
 *       - "description"
 *       - "longitude"
 *       - "latitude"
 *       - "start_date"
 *       - "end_date"
 *       - "city"
 *       - "postal_code"
 *       - "user_id"
 *       - "category_id"
 */

/**
 * @swagger
 * /api/advertisement:
 *   get:
 *     summary: Récupérer toutes les annonces
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Succès
 *         schema:
 *           type: array
 *           items:
 *             $ref: "#/definitions/Advertisement"
 *       500:
 *         description: Erreur du serveur
 *     tags:
 *       - Advertisement
 *   post:
 *     summary: Créer une nouvelle annonce
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Objet d'annonce à créer
 *         required: true
 *         schema:
 *           $ref: "#/definitions/Advertisement"
 *     responses:
 *       201:
 *         description: Annonce créée avec succès
 *         schema:
 *           $ref: "#/definitions/Advertisement"
 *       500:
 *         description: Erreur du serveur
 *     tags:
 *       - Advertisement
 */
router
  .route("/")
  .get(advertisementController.getAllAdvertisements)
  .post(advertisementController.createAdvertisement);

/**
 * @swagger
 * /api/advertisement/{id}:
 *   get:
 *     summary: Récupérer une annonce par ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de l'annonce à récupérer
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Succès
 *         schema:
 *           $ref: "#/definitions/Advertisement"
 *       404:
 *         description: Annonce non trouvée
 *       500:
 *         description: Erreur du serveur
 *     tags:
 *       - Advertisement
 *   delete:
 *     summary: Supprimer une annonce par ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de l'annonce à supprimer
 *         required: true
 *         type: string
 *     responses:
 *       204:
 *         description: Annonce supprimée avec succès
 *       404:
 *         description: Annonce non trouvée
 *       500:
 *         description: Erreur du serveur
 *     tags:
 *       - Advertisement
 *   put:
 *     summary: Mettre à jour une annonce par ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de l'annonce à mettre à jour
 *         required: true
 *         type: string
 *       - in: body
 *         name: body
 *         description: Objet d'annonce mis à jour
 *         required: true
 *         schema:
 *           $ref: "#/definitions/Advertisement"
 *     responses:
 *       200:
 *         description: Annonce mise à jour avec succès
 *         schema:
 *           $ref: "#/definitions/Advertisement"
 *       404:
 *         description: Annonce non trouvée
 *       500:
 *         description: Erreur du serveur
 *     tags:
 *       - Advertisement
 */
router
  .route("/:id")
  .get(advertisementController.getAdvertisementById)
  .delete(advertisementController.deleteAdvertisement)
  .put(advertisementController.updateAdvertisement);

/**
 * @swagger
 * /api/advertisement/user/{user_id}:
 *   get:
 *     summary: Récupérer toutes les annonces d'un utilisateur
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user_id
 *         in: path
 *         description: ID de l'utilisateur dont les annonces doivent être récupérées
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Succès
 *         schema:
 *           type: array
 *           items:
 *             $ref: "#/definitions/Advertisement"
 *       404:
 *         description: Annonces non trouvées pour l'utilisateur spécifié
 *       500:
 *         description: Erreur du serveur
 *     tags:
 *       - Advertisement
 */
router.get("/:user_id", advertisementController.getAdvertisementByIdUser);

/**
 * @swagger
 * /api/advertisement/category/{category_id}:
 *   get:
 *     summary: Récupérer toutes les annonces d'une catégorie
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: category_id
 *         in: path
 *         description: ID de la catégorie dont les annonces doivent être récupérées
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Succès
 *         schema:
 *           type: array
 *           items:
 *             $ref: "#/definitions/Advertisement"
 *       404:
 *         description: Annonces non trouvées pour la catégorie spécifiée
 *       500:
 *         description: Erreur du serveur
 *     tags:
 *       - Advertisement
 */
router.get("/:category_id", advertisementController.getAdvertisementByIdCategory);

module.exports = router;
