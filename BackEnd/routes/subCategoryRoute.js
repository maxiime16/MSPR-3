const express = require("express");
const router = express.Router();
const subCategoryController = require("../controllers/subCategoryController");

/**
 * @swagger
 * tags:
 *   name: SubCategories
 *   description: Operations related to sub-categories
 */

/**
 * @swagger
 * definitions:
 *   SubCategory:
 *     type: object
 *     required:
 *       - name
 *       - category_id
 *     properties:
 *       id:
 *         type: integer
 *       name:
 *         type: string
 *       category_id:
 *         type: integer
 */

/**
 * @swagger
 * /api/subcategory:
 *   get:
 *     summary: Retrieve a list of sub-categories
 *     tags: [SubCategories]
 *     responses:
 *       200:
 *         description: A list of sub-categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/SubCategory'
 */
router.get("/", subCategoryController.getAllSubCategories);

/**
 * @swagger
 * /api/subcategory/{id}:
 *   get:
 *     summary: Retrieve a sub-category by ID
 *     tags: [SubCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the sub-category to retrieve
 *     responses:
 *       200:
 *         description: Sub-category found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/SubCategory'
 *       400:
 *         description: Missing or invalid ID
 *       500:
 *         description: Server error
 */
router.get("/:id", subCategoryController.getSubCategoryById);

/**
 * @swagger
 * /api/subcategory/category/{category_id}:
 *   get:
 *     summary: Retrieve sub-categories by category ID
 *     tags: [SubCategories]
 *     parameters:
 *       - in: path
 *         name: category_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the category to retrieve sub-categories for
 *     responses:
 *       200:
 *         description: Sub-categories found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/SubCategory'
 *       400:
 *         description: Missing or invalid category ID
 *       500:
 *         description: Server error
 */
router.get("/category/:category_id", subCategoryController.getSubCategoryByCategoryId);

/**
 * @swagger
 * /api/subcategory/category/{category_id}/subcategory/{id}:
 *   get:
 *     summary: Retrieve a sub-category by category ID and sub-category ID
 *     tags: [SubCategories]
 *     parameters:
 *       - in: path
 *         name: category_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the category to retrieve sub-categories for
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the sub-category to retrieve
 *     responses:
 *       200:
 *         description: Sub-category found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/SubCategory'
 *       400:
 *         description: Missing or invalid IDs
 *       500:
 *         description: Server error
 */
router.get("/category/:category_id/subcategory/:id", subCategoryController.getSubCategoryByCategoryIdAndSubCategoryId);

/**
 * @swagger
 * /api/subcategory:
 *   post:
 *     summary: Create a new sub-category
 *     tags: [SubCategories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/SubCategory'
 *     responses:
 *       201:
 *         description: Sub-category created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/SubCategory'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/", subCategoryController.createSubCategory);

/**
 * @swagger
 * /api/subcategory/{id}:
 *   put:
 *     summary: Update a sub-category
 *     tags: [SubCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the sub-category to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/SubCategory'
 *     responses:
 *       200:
 *         description: Sub-category updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/SubCategory'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.put("/:id", subCategoryController.updateSubCategory);

/**
 * @swagger
 * /api/subcategory/{id}:
 *   delete:
 *     summary: Delete a sub-category
 *     tags: [SubCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the sub-category to delete
 *     responses:
 *       204:
 *         description: Sub-category deleted
 *       400:
 *         description: Missing or invalid ID
 *       500:
 *         description: Server error
 */
router.delete("/:id", subCategoryController.deleteSubCategory);

module.exports = router;
