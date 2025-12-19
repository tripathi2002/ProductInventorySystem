const Joi = require('joi');

/**
 * Create Product Validation
 */
exports.createProductSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(150)
    .required(),

  description: Joi.string()
    .allow('', null),

  quantity: Joi.number()
    .integer()
    .min(0)
    .required(),

  categoryIds: Joi.array()
    .items(Joi.number().integer().positive())
    .min(1)
    .required()
});

/**
 * List Products Validation (query params)
 */
exports.listProductsSchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10),

  search: Joi.string()
    .trim()
    .allow('', null),

  categoryIds: Joi.alternatives().try(
    Joi.array().items(Joi.number().integer().positive()),
    Joi.number().integer().positive()
  )
});
