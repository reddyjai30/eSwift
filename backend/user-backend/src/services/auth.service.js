import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { env } from '../config/env.js'
import ApiError from '../utils/ApiError.js'

export async function ensureUniquePhone(phone){
  const u = await User.findOne({ phone })
  if (u) throw ApiError.badRequest('Phone already registered')
  return true
}

export async function ensureExistingUser(phone){
  const u = await User.findOne({ phone })
  if (!u) throw ApiError.notFound('Account not found. Please sign up')
  return u
}

export async function createUserFromSignupMeta(meta){
  const { name, phone, email } = meta
  const u = await User.create({ name, phone, email })
  return u
}

export function issueToken(user){
  const token = jwt.sign({ sub: user.id, role: 'user', name: user.name, phone: user.phone }, env.jwtSecret, { expiresIn: env.jwtExpiresIn })
  return token
}

