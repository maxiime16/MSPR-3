const Joi = require("joi");

const subCategorySchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  category_id: Joi.number().integer().required(),
});

module.exports = subCategorySchema;
