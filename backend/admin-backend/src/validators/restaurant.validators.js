import Joi from "joi";

export const createRestaurantSchema = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  address: Joi.string().allow("", null),
  logoUrl: Joi.string().uri().allow("", null),
  logoKey: Joi.string().allow("", null),
  printer: Joi.object({
    agentKey: Joi.string().allow("", null),
    connection: Joi.string().valid("usb", "lan", "bt").default("usb"),
    escposProfile: Joi.string().default("80mm")
  }).default({})
});

export const updateRestaurantSchema = createRestaurantSchema.fork(
  ["name"], (s) => s.optional()
);
