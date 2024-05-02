// src/services/messageService.js

const messageModel = require('../models/messageModel');

// Service pour récupérer tous les messages d'une conversation
async function getMessagesByConversationId(conversationId) {
  try {
    const messages = await messageModel.getMessagesByConversationId(conversationId);
    return messages;
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    throw error;
  }
}

// Service pour créer un nouveau message
async function createMessage(message) {
  try {
    const newMessage = await messageModel.createMessage(message);
    return newMessage;
  } catch (error) {
    console.error('Erreur lors de la création du message:', error);
    throw error;
  }
}

module.exports = {
  getMessagesByConversationId,
  createMessage,
};
