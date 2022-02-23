const joi = require('@hapi/joi');

const productIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);
const productNameSchema = joi.string().min(5).max(100);
const productPriceSchema = joi.number().integer().min(2).max(2000);
const productThumbnailSchema = joi.string().uri()

const createProductSchema = {
  name: productNameSchema.required(),
  price: productPriceSchema.required(),
  thumbnail: productThumbnailSchema.required(),
};

const updateProductSchema = {
  name: productNameSchema,
  price: productPriceSchema,
  thumbnail: productThumbnailSchema,
};

module.exports = {
  productIdSchema,
  createProductSchema,
  updateProductSchema,
};
