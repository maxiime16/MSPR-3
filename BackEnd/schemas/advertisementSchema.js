const Joi = require("joi");

const advertisementSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  description: Joi.string().min(1).max(1000).required(),
  longitude: Joi.number().required(),
  latitude: Joi.number().required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().required(),
  city: Joi.string().min(1).max(100).required(),
  postal_code: Joi.string().min(1).max(20).required(),
  user_id: Joi.number().integer().required(),
  category_id: Joi.number().integer().required(),
  sub_category_id: Joi.number().integer().required(),
});

module.exports = advertisementSchema;
