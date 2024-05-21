const Joi = require("joi");

const ImageSchema = Joi.object({
    advertisement_id: Joi.number().integer().required(),
    image: Joi.binary().required()
})

module.exports = ImageSchema;
