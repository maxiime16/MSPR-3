// schemas/messageSchema.js
const Joi = require("joi");

const messageSchema = Joi.object({
  conversation_id: Joi.number().integer().required(),
  sender_id: Joi.number().integer().required(),
  content: Joi.string().required(),
  created_at: Joi.date().default(Date.now),
});

module.exports = messageSchema;
