const Joi = require("joi");

const plantSchema = Joi.object({
  name_plant: Joi.string().min(1).max(100).required(),
  description: Joi.string().max(500).required(),
  advertisement_id: Joi.number().integer().required(),
  subcategory_id: Joi.number().integer().required(),
});

module.exports = plantSchema;
