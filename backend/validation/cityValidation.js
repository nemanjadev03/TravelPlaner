const Joi = require('joi');

module.exports = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  description: Joi.string().allow('', null),
  location: Joi.object({
    lat: Joi.number().optional(),
    lng: Joi.number().optional()
  }).optional()
});