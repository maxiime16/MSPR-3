const express = require("express");
const router = express.Router();
const ImageController = require("../controllers/imageController");

/**
 * @swagger
 * tags:
 *   name: Pictures
 *   description: Operations related to pictures
 */

/**
 * @swagger
 * definitions:
 *   Image:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       image:
 *         type: string
 *         format: binary
 */

/**
 * @swagger
 * /api/image:
 *   get:
 *     summary: Retrieve a list of pictures
 *     tags: [Pictures]
 *     responses:
 *       200:
 *         description: A list of pictures
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Image'
 */
router.get("/", ImageController.getAllImage);

/**
 * @swagger
 * /api/image/{id}:
 *   get:
 *     summary: Retrieve a picture by ID
 *     tags: [Pictures]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the picture to retrieve
 *     responses:
 *       200:
 *         description: A picture
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Image'
 */
router.get("/:id", ImageController.getImageById);

/**
 * @swagger
 * /api/image:
 *   post:
 *     summary: Create a new Image
 *     tags: [Pictures]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
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
router.post("/", ImageController.CreateImage);


/**
 * @swagger
 * /api/image/{id}:
 *   delete:
 *     summary: Delete an advertisement
 *     tags: [Pictures]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the advertisement to delete
 *     responses:
 *       204:
 *         description: Images deleted
 *       400:
 *         description: Missing or invalid ID
 *       500:
 *         description: Server error
 */
router.delete("/:id", ImageController.DeleteImage);

module.exports = router;