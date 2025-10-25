import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import ApiError from '../utils/ApiError.js'

export function userAuth(req, _res, next){
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return next(ApiError.unauthorized('Missing token'))
  try {
    const payload = jwt.verify(token, env.jwtSecret)
    if (payload.role !== 'user') throw new Error('Invalid role')
    req.user = payload
    next()
  } catch { next(ApiError.unauthorized('Invalid/expired token')) }
}

