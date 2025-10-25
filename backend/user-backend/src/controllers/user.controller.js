import { ok } from '../utils/ApiResponse.js'
import ApiError from '../utils/ApiError.js'
import { User } from '../models/User.js'

export async function getProfile(req, res, next){
  try {
    const u = await User.findById(req.user.sub).select('name phone email createdAt updatedAt')
    if (!u) return next(ApiError.notFound('User not found'))
    res.json(ok(u))
  } catch(e){ next(e) }
}

export async function updateProfile(req, res, next){
  try {
    const { name, email } = req.body || {}
    const u = await User.findByIdAndUpdate(req.user.sub, { $set: { ...(name!=null?{name}:{}) , ...(email!=null?{email}:{}) } }, { new: true })
    if (!u) return next(ApiError.notFound('User not found'))
    res.json(ok(u, 'Profile updated'))
  } catch(e){ next(e) }
}

