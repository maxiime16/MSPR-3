const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");

/**
 * @swagger
 * tags:
 *   name: Addresses
 *   description: Operations related to addresses
 */

/**
 * @swagger
 * definitions:
 *   Address:
 *     type: object
 *     required:
 *       - city
 *       - postal_code
 *       - longitude
 *       - latitude
 *     properties:
 *       id:
 *         type: integer
 *       city:
 *         type: string
 *       postal_code:
 *         type: string
 *       longitude:
 *         type: number
 *       latitude:
 *         type: number
 */

/**
 * @swagger
 * /api/address:
 *   get:
 *     summary: Retrieve a list of addresses
 *     tags: [Addresses]
 *     responses:
 *       200:
 *         description: A list of addresses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Address'
 */
router.get("/", addressController.getAllAddresses);

/**
 * @swagger
 * /api/address/{id}:
 *   get:
 *     summary: Retrieve an address by ID
 *     tags: [Addresses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the address to retrieve
 *     responses:
 *       200:
 *         description: Address found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Address'
 *       400:
 *         description: Missing or invalid ID
 *       500:
 *         description: Server error
 */
router.get("/:id", addressController.getAddressById);

/**
 * @swagger
 * /api/address:
 *   post:
 *     summary: Create a new address
 *     tags: [Addresses]
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             postal_code:
 *               type: string
 *               example: "59000"
 *             city:
 *               type: string
 *               example: "Lille"
 *             longitude:
 *               type: number
 *               format: float
 *               example: 2.3522
 *             latitude:
 *               type: number
 *               format: float
 *               example: 48.8566
 *     responses:
 *       200:
 *         description: Create Adresse
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 *
 */
router.post("/", addressController.createAddress);

/**
 * @swagger
 * /api/address/{id}:
 *   put:
 *     summary: Update an address
 *     tags: [Addresses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the address to update
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             postal_code:
 *               type: string
 *               example: "59000"
 *             city:
 *               type: string
 *               example: "Lille"
 *             longitude:
 *               type: number
 *               format: float
 *               example: 2.3522
 *             latitude:
 *               type: number
 *               format: float
 *               example: 48.8566
 *         description: The ID of the address to update
 *     responses:
 *       200:
 *         description: Address updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Address'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.put("/:id", addressController.updateAddress);

/**
 * @swagger
 * /api/address/{id}:
 *   delete:
 *     summary: Delete an address
 *     tags: [Addresses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the address to delete
 *     responses:
 *       204:
 *         description: Address deleted
 *       400:
 *         description: Missing or invalid ID
 *       500:
 *         description: Server error
 */
router.delete("/:id", addressController.deleteAddress);

module.exports = router;
