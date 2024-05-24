const Joi = require("joi");

const addressSchema = Joi.object({
  city: Joi.string().min(1).max(100).required(),
  postal_code: Joi.string().min(1).max(20).required(),
  longitude: Joi.number().required(),
  latitude: Joi.number().required(),
});

module.exports = addressSchema;
