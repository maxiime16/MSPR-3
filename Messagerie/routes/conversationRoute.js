const express = require("express");
const router = express.Router();
const conversationController = require("../controllers/conversationController");

/**
 * @swagger
 * tags:
 *   name: Conversations
 *   description: Operations related to conversations
 */

/**
 * @swagger
 * definitions:
 *   Conversation:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       created_at:
 *         type: string
 *         format: date-time
 */

/**
 * @swagger
 * /api/conversation:
 *   get:
 *     summary: Retrieve a list of conversations
 *     tags: [Conversations]
 *     responses:
 *       200:
 *         description: A list of conversations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Conversation'
 */
router.get("/", conversationController.getAllConversations);

/**
 * @swagger
 * /api/conversation/{id}:
 *   get:
 *     summary: Retrieve a conversation by ID
 *     tags: [Conversations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the conversation to retrieve
 *     responses:
 *       200:
 *         description: Conversation found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Conversation'
 *       400:
 *         description: Missing or invalid ID
 *       500:
 *         description: Server error
 */
router.get("/:id", conversationController.getConversationById);

/**
 * @swagger
 * /api/conversation:
 *   post:
 *     summary: Create a new conversation
 *     tags: [Conversations]
 *     responses:
 *       201:
 *         description: Conversation created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Conversation'
 *       500:
 *         description: Server error
 */
router.post("/", conversationController.createConversation);

/**
 * @swagger
 * /api/conversation/{id}:
 *   delete:
 *     summary: Delete a conversation
 *     tags: [Conversations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the conversation to delete
 *     responses:
 *       204:
 *         description: Conversation deleted
 *       400:
 *         description: Missing or invalid ID
 *       500:
 *         description: Server error
 */
router.delete("/:id", conversationController.deleteConversation);

module.exports = router;
