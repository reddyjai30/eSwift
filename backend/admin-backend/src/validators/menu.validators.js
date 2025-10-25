import Joi from "joi";

export const createMenuItemSchema = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  price: Joi.number().min(0).required(),
  isAvailable: Joi.boolean().default(true),
  category: Joi.string().allow("", null),
  quantity: Joi.number().integer().min(0).default(0)
});

export const updateMenuItemSchema = Joi.object({
  name: Joi.string().min(2).max(120),
  price: Joi.number().min(0),
  isAvailable: Joi.boolean(),
  category: Joi.string().allow("", null),
  quantity: Joi.number().integer().min(0)
});
