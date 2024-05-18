const express = require("express");
const router = express.Router();
const participantController = require("../controllers/participantController");

/**
 * @swagger
 * tags:
 *   name: Participants
 *   description: Operations related to participants
 */

/**
 * @swagger
 * definitions:
 *   Participant:
 *     type: object
 *     required:
 *       - user_id
 *       - conversation_id
 *     properties:
 *       id:
 *         type: integer
 *       user_id:
 *         type: integer
 *       conversation_id:
 *         type: integer
 */

/**
 * @swagger
 * /api/participant:
 *   get:
 *     summary: Retrieve a list of participants
 *     tags: [Participants]
 *     responses:
 *       200:
 *         description: A list of participants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Participant'
 */
router.get("/", participantController.getAllParticipants);

/**
 * @swagger
 * /api/participant/conversation/{conversation_id}:
 *   get:
 *     summary: Retrieve participants by conversation ID
 *     tags: [Participants]
 *     parameters:
 *       - in: path
 *         name: conversation_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the conversation to retrieve participants for
 *     responses:
 *       200:
 *         description: Participants found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Participant'
 *       400:
 *         description: Missing or invalid conversation ID
 *       500:
 *         description: Server error
 */
router.get(
  "/conversation/:conversation_id",
  participantController.getParticipantsByConversationId
);

/**
 * @swagger
 * /api/participant/user/{user_id}:
 *   get:
 *     summary: Retrieve participants by user ID
 *     tags: [Participants]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to retrieve participants for
 *     responses:
 *       200:
 *         description: Participants found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Participant'
 *       400:
 *         description: Missing or invalid user ID
 *       500:
 *         description: Server error
 */
router.get("/user/:user_id", participantController.getParticipantsByUserId);

/**
 * @swagger
 * /api/participant:
 *   post:
 *     summary: Add a new participant
 *     tags: [Participants]
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user
 *       - in: query
 *         name: conversation_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the conversation
 *     responses:
 *       201:
 *         description: Participant added
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Participant'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/", participantController.addParticipant);

/**
 * @swagger
 * /api/participant/{id}:
 *   delete:
 *     summary: Delete a participant
 *     tags: [Participants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the participant to delete
 *     responses:
 *       204:
 *         description: Participant deleted
 *       400:
 *         description: Missing or invalid ID
 *       500:
 *         description: Server error
 */
router.delete("/:id", participantController.deleteParticipant);

module.exports = router;
