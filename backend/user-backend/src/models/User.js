import mongoose, { Schema } from 'mongoose'

const UserSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true, index: true },
  email: { type: String },
  isActive: { type: Boolean, default: true },
  lastLoginAt: { type: Date }
}, { timestamps: true })

export const User = mongoose.model('User', UserSchema)

