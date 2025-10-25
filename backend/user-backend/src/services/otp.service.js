import bcrypt from 'bcryptjs'
import { env } from '../config/env.js'
import { Otp } from '../models/Otp.js'
import { sendOtpSms, sendVerifyOtp, checkVerifyOtp } from './sms.service.js'
import ApiError from '../utils/ApiError.js'

function generateCode(){
  return String(Math.floor(100000 + Math.random()*900000))
}

export async function startOtp({ phone, purpose, metadata }){
  const now = new Date()
  const existing = await Otp.findOne({ phone, purpose }).sort({ createdAt: -1 })
  if (existing && existing.resendAfter > now) {
    const wait = Math.ceil((existing.resendAfter - now)/1000)
    throw ApiError.badRequest(`Please wait ${wait}s before requesting another code`)
  }
  const expiresAt = new Date(Date.now() + env.otpTtlSeconds*1000)
  const resendAfter = new Date(Date.now() + env.otpResendSeconds*1000)
  // Store metadata for signup; no codeHash needed when using Verify
  await Otp.create({ phone, purpose, expiresAt, resendAfter, metadata })
  if (env.twilioVerifyServiceSid) {
    await sendVerifyOtp(phone)
  } else {
    const code = generateCode()
    const codeHash = await bcrypt.hash(code, 10)
    await Otp.findOneAndUpdate({ phone, purpose }, { $set: { codeHash } })
    await sendOtpSms(phone, code)
  }
  return true
}

export async function verifyOtp({ phone, purpose, code }){
  const rec = await Otp.findOne({ phone, purpose }).sort({ createdAt: -1 })
  if (!rec) throw ApiError.badRequest('OTP not requested')
  if (rec.expiresAt < new Date()) throw ApiError.badRequest('OTP expired')
  if (env.twilioVerifyServiceSid) {
    const { valid } = await checkVerifyOtp(phone, code)
    if (!valid) throw ApiError.badRequest('Invalid code')
    await Otp.deleteMany({ phone, purpose })
    return rec.metadata || {}
  } else {
    if (rec.attempts >= 5) throw ApiError.badRequest('Too many attempts')
    const ok = await bcrypt.compare(code, rec.codeHash)
    rec.attempts += 1
    await rec.save()
    if (!ok) throw ApiError.badRequest('Invalid code')
    await Otp.deleteMany({ _id: rec._id })
    return rec.metadata || {}
  }
}
