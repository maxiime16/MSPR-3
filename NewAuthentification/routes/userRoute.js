const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Operations related to user
 * definitions:
 *   User:
 *     type: "object"
 *     properties:
 *       id:
 *         type: "integer"
 *       first_name:
 *         type: "string"
 *       last_name:
 *         type: "string"
 *       email:
 *         type: "string"
 *       password:
 *         type: "string"
 *     required:
 *       - "id"
 *       - "first_name"
 *       - "last_name"
 *       - "email"
 *       - "password"
 *   UserBis:
 *     type: "object"
 *     properties:
 *       first_name:
 *         type: "string"
 *       last_name:
 *         type: "string"
 *       email:
 *         type: "string"
 *       password:
 *         type: "string"
 *     required:
 *       - "first_name"
 *       - "last_name"
 *       - "email"
 *       - "password"
 */

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to get
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/User'
 *       404:
 *         description: User not found
 *   delete:
 *     summary: Delete user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to delete
 *     responses:
 *       200:
 *         description: Successful operation
 *       404:
 *         description: User not found
 *   put:
 *     summary: Update user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to update
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/UserBis'
 *         description: User object that needs to be updated
 *     responses:
 *       200:
 *         description: Successful operation
 *       400:
 *         description: Invalid request body
 *
 * /api/user/email/{email}:
 *   get:
 *     summary: Get user by email
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email of the user to get
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/User'
 *       404:
 *         description: User not found
 *
 * /api/user/:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     parameters:
 *       - in: body
 *         name: body
 *         required: true
 *         schema:
 *           $ref: "#/definitions/UserBis"
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid request body
 *
 *   get:
 *     summary: get all user
 *     tags: [User]
 *     responses:
 *       201:
 *         description: User created successfully
 *         schema:
 *           type: array
 *           items:
 *             $ref: "#/definitions/User"
 *       400:
 *         description: Invalid request body
 *
 * /user/login:
 *   post:
 *     summary: User login
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 first_name:
 *                   type: string
 *                 last_name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Incorrect email or password
 */

router
  .route("/:id")
  .get(userController.getUserById)
  .delete(userController.deleteUser)
  .put(userController.updateUser);

router.route("/").post(userController.createUser).get(userController.getAll);
router.get("/email/:email", userController.getUserByEmail);
router.post("/login", userController.loginUser);

module.exports = router;
