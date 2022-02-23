const joi = require('@hapi/joi');

const userIdSchema = joi.string().regex(/^[0-9a-fA-F]{24}$/);

const userAddressSchema = joi.string().min(5).max(15);
const userAgeSchema = joi.number().integer().min(2).max(65);
const userPhoneSchema = joi
  .string()
  .length(10)
  .pattern(/^[0-9]+$/);
const userUserNameSchema = joi.string().min(3).max(10);
const userEmailSchema = joi.string().email();
const userPasswordSchema = joi.string().regex(/^[a-zA-Z0-9]{3,30}$/);
const userAdminSchema = joi.boolean().default(false);
const userApiKeyTokenSchema = joi.string();

const userSchema = {
  address: userAddressSchema.required(),
  age: userAgeSchema.required(),
  phone: userPhoneSchema.required(),
  user_name: userUserNameSchema.required(),
  email: userEmailSchema.required(),
  password: userPasswordSchema.required(),
};
const createUserSchema = {
  ...userSchema,
  isAdmin: userAdminSchema,
};

const createProviderUserSchema = {
  ...userSchema,
  apiKeyToken: userApiKeyTokenSchema.required(),
};

const updateUserSchema = {
  address: userAddressSchema,
  age: userAgeSchema,
  phone: userPhoneSchema,
  user_name: userUserNameSchema,
  email: userEmailSchema,
  password: userPasswordSchema,
};

module.exports = {
  userIdSchema,
  createUserSchema,
  updateUserSchema,
  createProviderUserSchema,
};
