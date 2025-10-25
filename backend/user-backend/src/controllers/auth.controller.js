import { ok } from '../utils/ApiResponse.js'
import ApiError from '../utils/ApiError.js'
import { signupStartSchema, loginStartSchema, verifySchema } from '../validators/auth.validators.js'
import { startOtp, verifyOtp } from '../services/otp.service.js'
import { ensureExistingUser, ensureUniquePhone, createUserFromSignupMeta, issueToken } from '../services/auth.service.js'

export async function signupStart(req, res, next){
  try {
    const { value, error } = signupStartSchema.validate(req.body)
    if (error) return next(error)
    await ensureUniquePhone(value.phone)
    await startOtp({ phone: value.phone, purpose: 'signup', metadata: value })
    res.json(ok(true, 'OTP sent for signup'))
  } catch(e){ next(e) }
}

export async function signupVerify(req, res, next){
  try {
    const { value, error } = verifySchema.validate(req.body)
    if (error) return next(error)
    const meta = await verifyOtp({ phone: value.phone, purpose: 'signup', code: value.code })
    const user = await createUserFromSignupMeta(meta)
    const token = issueToken(user)
    res.json(ok({ token, user: { id: user.id, name: user.name, phone: user.phone } }, 'Signup successful'))
  } catch(e){ next(e) }
}

export async function loginStart(req, res, next){
  try {
    const { value, error } = loginStartSchema.validate(req.body)
    if (error) return next(error)
    await ensureExistingUser(value.phone)
    await startOtp({ phone: value.phone, purpose: 'login' })
    res.json(ok(true, 'OTP sent for login'))
  } catch(e){ next(e) }
}

export async function loginVerify(req, res, next){
  try {
    const { value, error } = verifySchema.validate(req.body)
    if (error) return next(error)
    await verifyOtp({ phone: value.phone, purpose: 'login', code: value.code })
    const user = await ensureExistingUser(value.phone)
    user.lastLoginAt = new Date(); await user.save()
    const token = issueToken(user)
    res.json(ok({ token, user: { id: user.id, name: user.name, phone: user.phone } }, 'Login successful'))
  } catch(e){ next(e) }
}

export async function me(req, res){
  const user = req.user
  res.json(ok({ user }))
}

