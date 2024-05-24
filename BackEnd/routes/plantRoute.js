const express = require("express");
const router = express.Router();
const plantController = require("../controllers/plantController");

/**
 * @swagger
 * tags:
 *   name: Plants
 *   description: Operations related to plants
 */

/**
 * @swagger
 * definitions:
 *   Plant:
 *     type: object
 *     required:
 *       - name_plant
 *       - description
 *       - advertisement_id
 *       - subcategory_id
 *     properties:
 *       id:
 *         type: integer
 *       name_plant:
 *         type: string
 *       description:
 *         type: string
 *       advertisement_id:
 *         type: integer
 *       subcategory_id:
 *         type: integer
 */

/**
 * @swagger
 * /api/plant:
 *   get:
 *     summary: Retrieve a list of plants
 *     tags: [Plants]
 *     responses:
 *       200:
 *         description: A list of plants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Plant'
 */
router.get("/", plantController.getAllPlants);

/**
 * @swagger
 * /api/plant/{id}:
 *   get:
 *     summary: Retrieve a plant by ID
 *     tags: [Plants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the plant to retrieve
 *     responses:
 *       200:
 *         description: Plant found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Plant'
 *       400:
 *         description: Missing or invalid ID
 *       500:
 *         description: Server error
 */
router.get("/:id", plantController.getPlantById);

/**
 * @swagger
 * /api/plant:
 *   post:
 *     summary: Create a new plant
 *     tags: [Plants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Plant'
 *     responses:
 *       201:
 *         description: Plant created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Plant'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/", plantController.createPlant);

/**
 * @swagger
 * /api/plant/{id}:
 *   put:
 *     summary: Update a plant
 *     tags: [Plants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the plant to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Plant'
 *     responses:
 *       200:
 *         description: Plant updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Plant'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.put("/:id", plantController.updatePlant);

/**
 * @swagger
 * /api/plant/{id}:
 *   delete:
 *     summary: Delete a plant
 *     tags: [Plants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the plant to delete
 *     responses:
 *       204:
 *         description: Plant deleted
 *       400:
 *         description: Missing or invalid ID
 *       500:
 *         description: Server error
 */
router.delete("/:id", plantController.deletePlant);

module.exports = router;
