import mongoose, { Schema } from 'mongoose'

const WalletSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', unique: true, index: true },
  balance: { type: Number, default: 0 },
}, { timestamps: true })

export const Wallet = mongoose.model('Wallet', WalletSchema)

const WalletTxnSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
  amount: Number,
  type: { type: String, enum: ['credit','debit'] },
  method: { type: String, enum: ['wallet','original'] },
  providerRefundId: String,
  status: { type: String, default: 'completed' }
}, { timestamps: true })

export const WalletTxn = mongoose.model('WalletTxn', WalletTxnSchema)

