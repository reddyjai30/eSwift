import Joi from "joi";

export const loginSchema = Joi.object({
  username: Joi.string().min(3).max(64).required(),
  password: Joi.string().min(6).max(128).required()
});

export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).max(128).required()
});

