const Joi = require("joi");

const adviceSchema = Joi.object({
  advice: Joi.string().min(1).max(1000).required(),
  advertisement_id: Joi.number().integer().required(),
  user_id: Joi.number().integer().required(),
});

module.exports = adviceSchema;
