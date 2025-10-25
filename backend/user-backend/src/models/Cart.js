import mongoose, { Schema } from 'mongoose'

const CartItemSchema = new Schema({
  itemId: { type: Schema.Types.ObjectId, required: true },
  name: String,
  price: Number,
  quantity: Number,
  imageUrl: String,
  category: String
}, { _id: false })

const CartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', unique: true, index: true },
  restaurantId: { type: Schema.Types.ObjectId, required: true, index: true },
  items: [CartItemSchema],
  currency: { type: String, default: 'INR' },
  subtotal: { type: Number, default: 0 },
  gstPercent: { type: Number, default: 5 },
  gstAmount: { type: Number, default: 0 },
  total: { type: Number, default: 0 }
}, { timestamps: true })

export const Cart = mongoose.model('Cart', CartSchema)

