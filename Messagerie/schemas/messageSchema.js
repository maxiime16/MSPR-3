// messageSchema.js
const Joi = require("joi");

const messageSchema = Joi.object({
  message: Joi.string().min(1).max(250).required(),
  id_User: Joi.number().integer().required(),
  id_User_Recepteur: Joi.number().integer().required(),
  id_Conversation: Joi.number().integer().required(),
});

module.exports = messageSchema;
