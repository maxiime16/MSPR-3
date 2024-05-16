const Joi = require('joi');

const conversationSchema = Joi.object({
  // Pas de champs à valider pour une conversation vide
});

module.exports = conversationSchema;
