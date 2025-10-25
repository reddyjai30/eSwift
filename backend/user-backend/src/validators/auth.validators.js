import Joi from 'joi'

export const signupStartSchema = Joi.object({
  name: Joi.string().min(2).max(80).required(),
  phone: Joi.string().min(10).max(20).required(),
  email: Joi.string().email().allow('', null)
})

export const loginStartSchema = Joi.object({
  phone: Joi.string().min(10).max(20).required()
})

export const verifySchema = Joi.object({
  phone: Joi.string().min(10).max(20).required(),
  code: Joi.string().length(6).pattern(/^\d{6}$/).required()
})

