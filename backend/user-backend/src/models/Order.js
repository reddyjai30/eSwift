import mongoose, { Schema } from 'mongoose'

const OrderItemSchema = new Schema({
  itemId: { type: Schema.Types.ObjectId, required: true },
  name: String,
  price: Number,
  quantity: Number,
  imageUrl: String,
  category: String
}, { _id: false })

const OrderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  restaurantId: { type: Schema.Types.ObjectId, index: true },
  items: [OrderItemSchema],
  currency: { type: String, default: 'INR' },
  subtotal: Number,
  gstPercent: Number,
  gstAmount: Number,
  total: Number,
  status: { type: String, enum: ['pending','paid','delivered','expired','refunded','failed','cancelled','released'], default: 'pending', index: true },
  provider: { type: String, default: 'razorpay' },

  // reservation tracking
  reserved: [{ itemId: Schema.Types.ObjectId, quantity: Number }],
  reservedUntil: { type: Date, index: true },
  reservationReleased: { type: Boolean, default: false },

  // razorpay fields
  rzOrderId: String,
  rzPaymentId: String,
  rzSignature: String,

  // QR
  qrToken: String,
  qrExpiresAt: Date,
  deliveredAt: Date,
  qrScannedAt: Date,

  // Refunds
  refundId: String,
  refundStatus: String,
  refundMethod: String,
}, { timestamps: true })

export const Order = mongoose.model('Order', OrderSchema)
