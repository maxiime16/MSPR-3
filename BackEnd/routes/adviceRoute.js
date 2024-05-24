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
 *       - user_id
 *       - plant_id
 *     properties:
 *       id:
 *         type: integer
 *       content:
 *         type: string
 *       user_id:
 *         type: integer
 *       plant_id:
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
 *       500:
 *         description: Server error
 */
router.get("/:id", adviceController.getAdviceById);

/**
 * @swagger
 * /api/advice:
 *   post:
 *     summary: Create new advice
 *     tags: [Advice]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Advice'
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Advice'
 *     responses:
 *       200:
 *         description: Advice updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Advice'
 *       400:
 *         description: Invalid input
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
 *       500:
 *         description: Server error
 */
router.delete("/:id", adviceController.deleteAdvice);

module.exports = router;
