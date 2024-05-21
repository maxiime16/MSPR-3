const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Operations related to categories
 */

/**
 * @swagger
 * definitions:
 *   Category:
 *     type: object
 *     required:
 *       - name
 *     properties:
 *       id:
 *         type: integer
 *       name:
 *         type: string
 */

/**
 * @swagger
 * /api/category:
 *   get:
 *     summary: Retrieve a list of categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Category'
 */
router.get("/", categoryController.getAllCategories);

/**
 * @swagger
 * /api/category/{id}:
 *   get:
 *     summary: Retrieve a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the category to retrieve
 *     responses:
 *       200:
 *         description: Category found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Category'
 *       400:
 *         description: Missing or invalid ID
 *       500:
 *         description: Server error
 */
router.get("/:id", categoryController.getCategoryById);

/**
 * @swagger
 * /api/category:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Category'
 *     responses:
 *       201:
 *         description: Category created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Category'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/", categoryController.createCategory);

/**
 * @swagger
 * /api/category/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the category to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Category'
 *     responses:
 *       200:
 *         description: Category updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Category'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.put("/:id", categoryController.updateCategory);

/**
 * @swagger
 * /api/category/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the category to delete
 *     responses:
 *       204:
 *         description: Category deleted
 *       400:
 *         description: Missing or invalid ID
 *       500:
 *         description: Server error
 */
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
