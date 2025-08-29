const Joi = require('joi');

module.exports = Joi.object({
  from: Joi.string().required(),
  to: Joi.string().required(),
  distance: Joi.number().positive().required(),
  bidirectional: Joi.boolean().optional()
});