const Joi = require("joi");

const advertisementSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().required(),
  user_id: Joi.number().integer().required(),
  address_id: Joi.number().integer().required(),
});

module.exports = advertisementSchema;
