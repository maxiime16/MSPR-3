const Joi = require("joi");

const categorySchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
});

module.exports = categorySchema;
