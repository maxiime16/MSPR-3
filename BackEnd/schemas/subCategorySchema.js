const Joi = require("joi");

const subCategorySchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  id_category: Joi.number().integer().required(),
});

module.exports = subCategorySchema;
