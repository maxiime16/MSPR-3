const express = require("express");
const router = express.Router();
const imageController = require("../controllers/imageController");

/**
 * @swagger
 * tags:
 *   name: Images
 *   description: Operations related to images
 */

/**
 * @swagger
 * definitions:
 *   Image:
 *     type: object
 *     required:
 *       - image
 *       - plant_id
 *     properties:
 *       id:
 *         type: integer
 *       image:
 *         type: string
 *         format: binary
 *       plant_id:
 *         type: integer
 */

/**
 * @swagger
 * /api/image:
 *   get:
 *     summary: Retrieve a list of images
 *     tags: [Images]
 *     responses:
 *       200:
 *         description: A list of images
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Image'
 */
router.get("/", imageController.getAllImages);

/**
 * @swagger
 * /api/image/{id}:
 *   get:
 *     summary: Retrieve an image by ID
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the image to retrieve
 *     responses:
 *       200:
 *         description: Image found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Image'
 *       400:
 *         description: Missing or invalid ID
 *       500:
 *         description: Server error
 */
router.get("/:id", imageController.getImageById);

/**
 * @swagger
 * /api/image/plant/{plant_id}:
 *   get:
 *     summary: Retrieve images by plant ID
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: plant_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the plant to retrieve images for
 *     responses:
 *       200:
 *         description: Images found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Image'
 *       400:
 *         description: Missing or invalid plant ID
 *       500:
 *         description: Server error
 */
router.get("/plant/:plant_id", imageController.getImagesByPlantId);

/**
 * @swagger
 * /api/image:
 *   post:
 *     summary: Create a new image
 *     tags: [Images]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Image'
 *     responses:
 *       201:
 *         description: Image created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Image'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/", imageController.createImage);

/**
 * @swagger
 * /api/image/{id}:
 *   delete:
 *     summary: Delete an image
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the image to delete
 *     responses:
 *       204:
 *         description: Image deleted
 *       400:
 *         description: Missing or invalid ID
 *       500:
 *         description: Server error
 */
router.delete("/:id", imageController.deleteImage);

module.exports = router;
