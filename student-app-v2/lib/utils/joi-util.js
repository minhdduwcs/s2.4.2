const Joi = require('joi');

module.exports = {
  defaultSchema: Joi.object({
    dataTag: Joi.alternatives().try(Joi.array(), Joi.string()),
    timezone: Joi.string(),
    holderId: Joi.string()
  })
};
