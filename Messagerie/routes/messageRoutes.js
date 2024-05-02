// src/routes/messageRoutes.js

const express = require('express');
const messageController = require('../controllers/messageController');

const router = express.Router();

// Route pour récupérer tous les messages d'une conversation
router.get('/conversations/:conversationId/messages', messageController.getMessages);

// Route pour créer un nouveau message
router.post('/messages', messageController.createMessage);

module.exports = router;
