const express = require("express");
const router = express.Router();
const advertisementController = require("../controllers/advertisementController");

/**
 * @swagger
 * tags:
 *   name: Advertisements
 *   description: Operations related to advertisements
 */

/**
 * @swagger
 * definitions:
 *   Advertisement:
 *     type: object
 *     required:
 *       - title
 *       - start_date
 *       - end_date
 *       - user_id
 *       - address_id
 *     properties:
 *       id:
 *         type: integer
 *       title:
 *         type: string
 *       start_date:
 *         type: string
 *         format: date-time
 *       end_date:
 *         type: string
 *         format: date-time
 *       user_id:
 *         type: integer
 *       address_id:
 *         type: integer
 * 
 *   AdvertisementDetail:
 *     type: object
 *     required:
 *       - title
 *       - description
 *       - longitude
 *       - latitude
 *       - start_date
 *       - end_date
 *       - city
 *       - postal_code
 *       - user_id
 *       - category_id
 *       - sub_category_id
 *     properties:
 *       id:
 *         type: integer
 *       title:
 *         type: string
 *       description:
 *         type: string
 *       longitude:
 *         type: number
 *       latitude:
 *         type: number
 *       start_date:
 *         type: string
 *         format: date-time
 *       end_date:
 *         type: string
 *         format: date-time
 *       city:
 *         type: string
 *       postal_code:
 *         type: string
 *       user_id:
 *         type: integer
 *       category_id:
 *         type: integer
 *       sub_category_id:
 *         type: integer
 */

/**
 * @swagger
 * /api/advertisement/details:
 *   get:
 *     summary: Retrieve detailed advertisement information
 *     tags: [Advertisements]
 *     responses:
 *       200:
 *         description: Detailed advertisement information
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/AdvertisementDetail'
 */
router.get("/details", advertisementController.getAdvertisementDetails);

/**
 * @swagger
 * /api/advertisement:
 *   get:
 *     summary: Retrieve a list of advertisements
 *     tags: [Advertisements]
 *     responses:
 *       200:
 *         description: A list of advertisements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Advertisement'
 */
router.get("/", advertisementController.getAllAdvertisements);

/**
 * @swagger
 * /api/advertisement/{id}:
 *   get:
 *     summary: Retrieve an advertisement by ID
 *     tags: [Advertisements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the advertisement to retrieve
 *     responses:
 *       200:
 *         description: Advertisement found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Advertisement'
 *       400:
 *         description: Missing or invalid ID
 *       500:
 *         description: Server error
 */
router.get("/:id", advertisementController.getAdvertisementById);

/**
 * @swagger
 * /api/advertisement/user/{user_id}:
 *   get:
 *     summary: Retrieve advertisements by user ID
 *     tags: [Advertisements]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to retrieve advertisements for
 *     responses:
 *       200:
 *         description: Advertisements found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Advertisement'
 *       400:
 *         description: Missing or invalid user ID
 *       500:
 *         description: Server error
 */
router.get("/user/:user_id", advertisementController.getAdvertisementByUserId);

/**
 * @swagger
 * /api/advertisement/address/{address_id}:
 *   get:
 *     summary: Retrieve advertisements by address ID
 *     tags: [Advertisements]
 *     parameters:
 *       - in: path
 *         name: address_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the address to retrieve advertisements for
 *     responses:
 *       200:
 *         description: Advertisements found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Advertisement'
 *       400:
 *         description: Missing or invalid address ID
 *       500:
 *         description: Server error
 */
router.get("/address/:address_id", advertisementController.getAdvertisementByAddressId);

/**
 * @swagger
 * /api/advertisement:
 *   post:
 *     summary: Create a new advertisement
 *     tags: [Advertisements]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Advertisement'
 *     responses:
 *       201:
 *         description: Advertisement created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Advertisement'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/", advertisementController.createAdvertisement);

/**
 * @swagger
 * /api/advertisement/{id}:
 *   put:
 *     summary: Update an advertisement
 *     tags: [Advertisements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the advertisement to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Advertisement'
 *     responses:
 *       200:
 *         description: Advertisement updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Advertisement'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.put("/:id", advertisementController.updateAdvertisement);

/**
 * @swagger
 * /api/advertisement/{id}:
 *   delete:
 *     summary: Delete an advertisement
 *     tags: [Advertisements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the advertisement to delete
 *     responses:
 *       204:
 *         description: Advertisement deleted
 *       400:
 *         description: Missing or invalid ID
 *       500:
 *         description: Server error
 */
router.delete("/:id", advertisementController.deleteAdvertisement);

module.exports = router;