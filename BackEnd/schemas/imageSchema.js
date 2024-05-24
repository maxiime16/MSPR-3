const Joi = require("joi");

const imageSchema = Joi.object({
  image: Joi.string().base64().required(),
  plant_id: Joi.number().integer().required(),
});

module.exports = imageSchema;
