import dotenv from 'dotenv'
dotenv.config()

export const env = {
  port: Number(process.env.PORT || 5002),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  mongoUri: process.env.MONGO_URI || '',
  adminMongoUri: process.env.ADMIN_MONGO_URI || process.env.MONGO_URI || '',
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  otpTtlSeconds: Number(process.env.OTP_TTL_SECONDS || 300),
  otpResendSeconds: Number(process.env.OTP_RESEND_SECONDS || 30),
  gstPercent: Number(process.env.GST_PERCENT || 5),
  twilioSid: process.env.TWILIO_ACCOUNT_SID || '',
  twilioToken: process.env.TWILIO_AUTH_TOKEN || '',
  twilioMsgServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID || '',
  twilioFrom: process.env.TWILIO_FROM || '',
  twilioVerifyServiceSid: process.env.TWILIO_VERIFY_SERVICE_SID || '',
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || '',
  orderTtlMinutes: Number(process.env.ORDER_TTL_MINUTES || 10),
  qrSecret: process.env.QR_SECRET || 'change_me_qr_secret',
  // Default QR expiry reduced to 2 minutes for faster testing
  qrTtlMinutes: Number(process.env.QR_TTL_MINUTES || 2),
}
if (!env.mongoUri) throw new Error('MONGO_URI missing')
if (!env.jwtSecret) throw new Error('JWT_SECRET missing')
if (!env.twilioSid || !env.twilioToken) console.warn('Twilio credentials not set - OTP SMS will fail until configured')
