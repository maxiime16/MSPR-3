const express = require("express");
const router = express.Router();
const adviceController = require("../controllers/adviceController");

/**
 * @swagger
 * tags:
 *   name: Advice
 *   description: Operations related to advice
 */

/**
 * @swagger
 * definitions:
 *   Advice:
 *     type: object
 *     required:
 *       - content
 *       - id_user
 *       - id_plant
 *     properties:
 *       id:
 *         type: integer
 *       content:
 *         type: string
 *       creation_date:
 *         type: string
 *         format: date
 *       id_user:
 *         type: integer
 *       id_plant:
 *         type: integer
 */

/**
 * @swagger
 * /api/advice:
 *   get:
 *     summary: Retrieve a list of advice
 *     tags: [Advice]
 *     responses:
 *       200:
 *         description: A list of advice
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Advice'
 */
router.get("/", adviceController.getAllAdvice);

/**
 * @swagger
 * /api/advice/{id}:
 *   get:
 *     summary: Retrieve advice by ID
 *     tags: [Advice]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the advice to retrieve
 *     responses:
 *       200:
 *         description: Advice found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Advice'
 *       400:
 *         description: Missing or invalid ID
 *       404:
 *         description: Advice not found
 *       500:
 *         description: Server error
 */
router.get("/:id", adviceController.getAdviceById);

/**
 * @swagger
 * /api/advice/plant/{id_plant}:
 *   get:
 *     summary: Retrieve advice by plant ID
 *     tags: [Advice]
 *     parameters:
 *       - in: path
 *         name: id_plant
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the plant to retrieve advice for
 *     responses:
 *       200:
 *         description: Advice found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Advice'
 *       400:
 *         description: Missing or invalid plant ID
 *       404:
 *         description: Advice not found for this plant
 *       500:
 *         description: Server error
 */
router.get("/plant/:id_plant", adviceController.getAdviceByPlantId);

/**
 * @swagger
 * /api/advice:
 *   post:
 *     summary: Create new advice
 *     tags: [Advice]
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             content:
 *               type: string
 *             id_user:
 *               type: integer
 *             id_plant:
 *               type: integer
 *     responses:
 *       201:
 *         description: Advice created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Advice'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/", adviceController.createAdvice);

/**
 * @swagger
 * /api/advice/{id}:
 *   put:
 *     summary: Update advice
 *     tags: [Advice]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the advice to update
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             content:
 *               type: string
 *             id_user:
 *               type: integer
 *             id_plant:
 *               type: integer
 *     responses:
 *       200:
 *         description: Advice updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Advice'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Advice not found
 *       500:
 *         description: Server error
 */
router.put("/:id", adviceController.updateAdvice);

/**
 * @swagger
 * /api/advice/{id}:
 *   delete:
 *     summary: Delete advice
 *     tags: [Advice]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the advice to delete
 *     responses:
 *       204:
 *         description: Advice deleted
 *       400:
 *         description: Missing or invalid ID
 *       404:
 *         description: Advice not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", adviceController.deleteAdvice);

module.exports = router;
