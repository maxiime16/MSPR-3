const express = require("express");
const router = express.Router();
const adviceController = require("../controllers/adviceController");

/**
 * @swagger
 * tags:
 *   name: Advices
 *   description: Operations related to advices
 */

/**
 * @swagger
 * definitions:
 *   Advice:
 *     type: object
 *     required:
 *       - advice
 *       - advertisement_id
 *       - user_id
 *     properties:
 *       id:
 *         type: integer
 *       advice:
 *         type: string
 *       advertisement_id:
 *         type: integer
 *       user_id:
 *         type: integer
 */

/**
 * @swagger
 * /api/advice:
 *   get:
 *     summary: Retrieve a list of advices
 *     tags: [Advices]
 *     responses:
 *       200:
 *         description: A list of advices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Advice'
 */
router.get("/", adviceController.getAllAdvices);

/**
 * @swagger
 * /api/advice/{id}:
 *   get:
 *     summary: Retrieve an advice by ID
 *     tags: [Advices]
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
 *     summary: Create a new advice
 *     tags: [Advices]
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
 *     summary: Update an advice
 *     tags: [Advices]
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
 *     summary: Delete an advice
 *     tags: [Advices]
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
