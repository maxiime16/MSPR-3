const Joi = require("joi");

const imageSchema = Joi.object({
  image: Joi.string().base64().required(),
  id_Plant: Joi.number().integer().required(),
});

module.exports = imageSchema;
