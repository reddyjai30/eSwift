import mongoose, { Schema } from 'mongoose'

const OtpSchema = new Schema({
  phone: { type: String, required: true, index: true },
  purpose: { type: String, enum: ['signup','login'], required: true, index: true },
  codeHash: { type: String },
  attempts: { type: Number, default: 0 },
  resendAfter: { type: Date, required: true },
  metadata: { type: Object },
  expiresAt: { type: Date, required: true }
}, { timestamps: true })

OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const Otp = mongoose.model('Otp', OtpSchema)
