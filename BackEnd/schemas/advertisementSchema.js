const Joi = require("joi");

const advertisementSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().required(),
  id_user: Joi.number().integer().required(),
  id_address: Joi.number().integer().required(),
});

module.exports = advertisementSchema;
