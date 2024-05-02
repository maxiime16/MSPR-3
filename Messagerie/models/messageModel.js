// src/models/messageModel.js

const db = require('../db/db');

// Fonction pour récupérer tous les messages d'une conversation
async function getMessagesByConversationId(conversationId) {
  try {
    const query = 'SELECT * FROM Messages WHERE id_conversation = $1';
    const result = await db.query(query, [conversationId]);
    return result.rows;
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    throw error;
  }
}

// Fonction pour créer un nouveau message
async function createMessage(message) {
  const { id_conversation, id_expéditeur, contenu } = message;
  try {
    const query = 'INSERT INTO Messages (id_conversation, id_expéditeur, contenu) VALUES ($1, $2, $3) RETURNING *';
    const result = await db.query(query, [id_conversation, id_expéditeur, contenu]);
    return result.rows[0];
  } catch (error) {
    console.error('Erreur lors de la création du message:', error);
    throw error;
  }
}

module.exports = {
  getMessagesByConversationId,
  createMessage,
};
