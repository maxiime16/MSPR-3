const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Operations related to messages
 */

/**
 * @swagger
 * definitions:
 *   Message:
 *     type: object
 *     required:
 *       - conversation_id
 *       - sender_id
 *       - content
 *     properties:
 *       id:
 *         type: integer
 *       conversation_id:
 *         type: integer
 *       sender_id:
 *         type: integer
 *       content:
 *         type: string
 *       created_at:
 *         type: string
 *         format: date-time
 */

/**
 * @swagger
 * /api/message:
 *   get:
 *     summary: Retrieve a list of messages
 *     tags: [Messages]
 *     responses:
 *       200:
 *         description: A list of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Message'
 */
router.get("/", messageController.getAllMessages);

/**
 * @swagger
 * /api/message/conversation/{conversation_id}:
 *   get:
 *     summary: Retrieve messages by conversation ID
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: conversation_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the conversation to retrieve messages for
 *     responses:
 *       200:
 *         description: Messages found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Message'
 *       400:
 *         description: Missing or invalid conversation ID
 *       500:
 *         description: Server error
 */
router.get(
  "/conversation/:conversation_id",
  messageController.getMessagesByConversationId
);

/**
 * @swagger
 * /api/message/{id}:
 *   get:
 *     summary: Retrieve a message by ID
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the message to retrieve
 *     responses:
 *       200:
 *         description: Message found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Message'
 *       400:
 *         description: Missing or invalid message ID
 *       500:
 *         description: Server error
 */
router.get("/:id", messageController.getMessageById);

/**
 * @swagger
 * /api/message:
 *   post:
 *     summary: Create a new message
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Message'
 *     responses:
 *       201:
 *         description: Message created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Message'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/", messageController.createMessage);

/**
 * @swagger
 * /api/message/{id}:
 *   delete:
 *     summary: Delete a message
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the message to delete
 *     responses:
 *       204:
 *         description: Message deleted
 *       400:
 *         description: Missing or invalid ID
 *       500:
 *         description: Server error
 */
router.delete("/:id", messageController.deleteMessage);

module.exports = router;
