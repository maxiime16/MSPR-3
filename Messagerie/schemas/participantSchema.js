const Joi = require("joi");

const participantSchema = Joi.object({
  user_id: Joi.number().integer().required(),
  conversation_id: Joi.number().integer().required(),
});

module.exports = participantSchema;
