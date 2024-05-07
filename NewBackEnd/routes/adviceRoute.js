const express = require("express");
const router = express.Router();
const adviceController = require("../controllers/adviceController");

/**
 * @swagger
 * tags:
 *   name: Advice
 *   description: Operations related to advice
 * definitions:
 *   Advice:
 *     type: "object"
 *     properties:
 *       id:
 *         type: "integer"
 *       advertisement_id:
 *         type: "integer"
 *       user_id:
 *         type: "integer"
 *       advice:
 *         type: "string"
 *     required:
 *       - "id"
 *       - "advertisement_id"
 *       - "user_id"
 *       - "advice"
 *   AdviceBis:
 *     type: "object"
 *     properties:
 *       advertisement_id:
 *         type: "integer"
 *       user_id:
 *         type: "integer"
 *       advice:
 *         type: "string"
 *     required:
 *       - "advertisement_id"
 *       - "user_id"
 *       - "advice"
 */

/**
 * @swagger
 * /api/advice:
 *   get:
 *     summary: Récupérer tous les conseils
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Succès
 *         schema:
 *           type: array
 *           items:
 *             $ref: "#/definitions/Advice"
 *       500:
 *         description: Erreur du serveur
 *     tags:
 *       - Advice
 *   post:
 *     summary: Créer un nouveau conseil
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Objet de conseil à créer
 *         required: true
 *         schema:
 *           $ref: "#/definitions/Advice"
 *     responses:
 *       201:
 *         description: Conseil créé avec succès
 *         schema:
 *           $ref: "#/definitions/AdviceBis"
 *       500:
 *         description: Erreur du serveur
 *     tags:
 *       - Advice
 */
router
  .route("/")
  .get(adviceController.getAllAdvices)
  .post(adviceController.createAdvice);

/**
 * @swagger
 * /api/advice/{id}:
 *   get:
 *     summary: Récupérer un conseil par ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID du conseil à récupérer
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Succès
 *         schema:
 *           $ref: "#/definitions/Advice"
 *       404:
 *         description: Conseil non trouvé
 *       500:
 *         description: Erreur du serveur
 *     tags:
 *       - Advice
 *   delete:
 *     summary: Supprimer un conseil par ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID du conseil à supprimer
 *         required: true
 *         type: string
 *     responses:
 *       204:
 *         description: Conseil supprimé avec succès
 *       404:
 *         description: Conseil non trouvé
 *       500:
 *         description: Erreur du serveur
 *     tags:
 *       - Advice
 *   put:
 *     summary: Mettre à jour un conseil par ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID du conseil à mettre à jour
 *         required: true
 *         type: string
 *       - in: body
 *         name: body
 *         description: Objet de conseil mis à jour
 *         required: true
 *         schema:
 *           $ref: "#/definitions/AdviceBis"
 *     responses:
 *       200:
 *         description: Conseil mis à jour avec succès
 *         schema:
 *           $ref: "#/definitions/Advice"
 *       404:
 *         description: Conseil non trouvé
 *       500:
 *         description: Erreur du serveur
 *     tags:
 *       - Advice
 */
router
  .route("/:id")
  .get(adviceController.getAdviceById)
  .delete(adviceController.deleteAdvice)
  .put(adviceController.updateAdvice);

module.exports = router;
