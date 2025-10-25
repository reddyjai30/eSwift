import twilio from 'twilio'
import { env } from '../config/env.js'

const client = env.twilioSid && env.twilioToken ? twilio(env.twilioSid, env.twilioToken) : null

export async function sendOtpSms(to, code){
  if (!client) throw new Error('Twilio not configured')
  const body = `eSwift verification code: ${code}`
  const params = env.twilioMsgServiceSid
    ? { to, body, messagingServiceSid: env.twilioMsgServiceSid }
    : { to, body, from: env.twilioFrom }
  const res = await client.messages.create(params)
  return { sid: res.sid }
}

export async function sendVerifyOtp(to){
  if (!client || !env.twilioVerifyServiceSid) throw new Error('Twilio Verify not configured')
  const res = await client.verify.v2.services(env.twilioVerifyServiceSid)
    .verifications
    .create({ to, channel: 'sms' })
  return { sid: res.sid, status: res.status }
}

export async function checkVerifyOtp(to, code){
  if (!client || !env.twilioVerifyServiceSid) throw new Error('Twilio Verify not configured')
  const res = await client.verify.v2.services(env.twilioVerifyServiceSid)
    .verificationChecks
    .create({ to, code })
  return { status: res.status, valid: res.status === 'approved' }
}
