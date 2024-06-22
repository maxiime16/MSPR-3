const Joi = require("joi");

const adviceSchema = Joi.object({
  content: Joi.string().required(),
  id_user: Joi.number().integer().required(),
  id_plant: Joi.number().integer().required(),
});

module.exports = adviceSchema;
