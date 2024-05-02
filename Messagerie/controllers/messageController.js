// src/controllers/messageController.js

const messageModel = require('../models/messageModel');

// Contrôleur pour récupérer tous les messages d'une conversation
async function getMessages(req, res) {
  const conversationId = req.params.conversationId;
  try {
    const messages = await messageModel.getMessagesByConversationId(conversationId);
    res.json(messages);
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
  }
}

// Contrôleur pour créer un nouveau message
async function createMessage(req, res) {
  const { id_conversation, id_expéditeur, contenu } = req.body;
  const message = { id_conversation, id_expéditeur, contenu };
  try {
    const newMessage = await messageModel.createMessage(message);
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Erreur lors de la création du message:', error);
    res.status(500).json({ error: 'Erreur lors de la création du message' });
  }
}

module.exports = {
  getMessages,
  createMessage,
};
