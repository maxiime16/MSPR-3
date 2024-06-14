const Joi = require("joi");

const plantSchema = Joi.object({
  name_plant: Joi.string().min(1).max(100).required(),
  description: Joi.string().required(),
  id_advertisement: Joi.number().integer().required(),
  id_sub_category: Joi.number().integer().required(),
});

module.exports = plantSchema;
