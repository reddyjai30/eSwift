import Razorpay from 'razorpay'
import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { Cart } from '../models/Cart.js'
import { MenuItem } from '../modelsAdmin/MenuItem.js'
import { Order } from '../models/Order.js'
import ApiError from '../utils/ApiError.js'

const rz = (env.razorpayKeyId && env.razorpayKeySecret) ? new Razorpay({ key_id: env.razorpayKeyId, key_secret: env.razorpayKeySecret }) : null

function round2(n){ return Math.round(n*100)/100 }

export async function createOrderFromCart(userId){
  const cart = await Cart.findOne({ userId })
  if (!cart || !cart.items?.length) throw ApiError.badRequest('Cart is empty')

  // Validate stock and availability
  const ids = cart.items.map(i=>i.itemId)
  const rows = await MenuItem.find({ _id: { $in: ids }, restaurantId: cart.restaurantId }).select('name quantity isAvailable')
  const map = new Map(rows.map(r=>[String(r._id), r]))

  const problems = []
  for (const it of cart.items){
    const m = map.get(String(it.itemId))
    if (!m){ problems.push({ itemId: it.itemId, reason: 'missing' }); continue }
    if (!m.isAvailable){ problems.push({ itemId: it.itemId, reason: 'unavailable' }) }
    else if ((m.quantity ?? 0) <= 0){ problems.push({ itemId: it.itemId, reason: 'out_of_stock' }) }
    else if (it.quantity > m.quantity){ problems.push({ itemId: it.itemId, reason: 'insufficient', available: m.quantity }) }
  }
  if (problems.length) {
    const err = ApiError.badRequest('Some items are unavailable or exceed stock')
    err.details = { code: 'STOCK_CONFLICT', items: problems }
    throw err
  }

  // Reserve stock by decrementing quantities atomically
  const reserved = []
  try {
    for (const it of cart.items){
      const upd = await MenuItem.findOneAndUpdate(
        { _id: it.itemId, restaurantId: cart.restaurantId, isAvailable: true, quantity: { $gte: it.quantity } },
        { $inc: { quantity: -it.quantity } },
        { new: true }
      )
      if (!upd) throw ApiError.badRequest(`${it.name} just went low on stock`)
      reserved.push({ itemId: it.itemId, quantity: it.quantity })
    }
  } catch (e) {
    // rollback any partial reserves
    for (const r of reserved){ await MenuItem.updateOne({ _id: r.itemId }, { $inc: { quantity: r.quantity } }) }
    throw e
  }

  // Create pending Order in our DB
  const reservedUntil = new Date(Date.now() + env.orderTtlMinutes*60*1000)
  const order = await Order.create({
    userId,
    restaurantId: cart.restaurantId,
    items: cart.items,
    currency: cart.currency,
    subtotal: cart.subtotal,
    gstPercent: cart.gstPercent,
    gstAmount: cart.gstAmount,
    total: cart.total,
    status: 'pending',
    reserved,
    reservedUntil,
  })

  if (!rz) throw new Error('Razorpay not configured')
  const rOrder = await rz.orders.create({ amount: Math.round(order.total*100), currency: order.currency, receipt: String(order._id) })
  order.rzOrderId = rOrder.id
  await order.save()

  return { orderId: order._id, razorpayOrderId: rOrder.id, amount: rOrder.amount, currency: rOrder.currency, keyId: env.razorpayKeyId }
}

export async function verifyPaymentSignature({ razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId }){
  const order = await Order.findById(orderId)
  if (!order || order.status !== 'pending') throw ApiError.badRequest('Invalid order')
  const body = `${razorpay_order_id}|${razorpay_payment_id}`
  const expected = crypto.createHmac('sha256', env.razorpayKeySecret).update(body).digest('hex')
  const ok = expected === razorpay_signature
  if (!ok) throw ApiError.badRequest('Signature verification failed')
  order.status = 'paid'
  order.rzOrderId = razorpay_order_id
  order.rzPaymentId = razorpay_payment_id
  order.rzSignature = razorpay_signature
  // Generate QR token with TTL
  const expSeconds = Math.floor(Date.now()/1000) + env.qrTtlMinutes*60
  const token = jwt.sign({ oid: String(order._id), rid: String(order.restaurantId), n: crypto.randomBytes(6).toString('hex'), exp: expSeconds }, env.qrSecret)
  order.qrToken = token
  order.qrExpiresAt = new Date(expSeconds*1000)
  await order.save()
  // Optionally: clear cart
  await Cart.deleteOne({ userId: order.userId })
  return order
}

export async function cancelAndRelease({ orderId }){
  const order = await Order.findById(orderId)
  if (!order) throw ApiError.notFound('Order not found')
  if (order.status !== 'pending') return order
  // Release reserved stock
  for (const r of order.reserved){ await MenuItem.updateOne({ _id: r.itemId }, { $inc: { quantity: r.quantity } }) }
  order.status = 'cancelled'
  order.reservationReleased = true
  await order.save()
  return order
}

export async function releaseExpiredReservations(){
  const now = new Date()
  const pendings = await Order.find({ status: 'pending', reservedUntil: { $lt: now }, reservationReleased: { $ne: true } }).limit(50)
  for (const o of pendings){
    for (const r of o.reserved){ await MenuItem.updateOne({ _id: r.itemId }, { $inc: { quantity: r.quantity } }) }
    o.status = 'released'
    o.reservationReleased = true
    await o.save()
  }
  return pendings.length
}

export async function expirePaidAndRefund(){
  const now = new Date()
  const due = await Order.find({ status: 'paid', qrExpiresAt: { $lt: now } }).limit(20)
  for (const o of due){
    try {
      // Only expire and release stock; wallet/original refund can be initiated by user action
      for (const r of o.reserved){ await MenuItem.updateOne({ _id: r.itemId }, { $inc: { quantity: r.quantity } }) }
      o.status = 'expired'
      o.qrToken = null
      await o.save()
    } catch (e) { }
  }
  return due.length
}

export async function activateByQrToken(token){
  let payload
  try { payload = jwt.verify(token, env.qrSecret) } catch { throw ApiError.badRequest('Invalid/expired QR') }
  const order = await Order.findById(payload.oid)
  if (!order) throw ApiError.badRequest('Order not found')
  if (order.status !== 'paid') throw ApiError.badRequest('Order not in scannable state')
  if (order.qrExpiresAt && order.qrExpiresAt < new Date()) throw ApiError.badRequest('QR expired')
  const now = new Date()
  order.status = 'delivered'
  order.deliveredAt = now
  order.qrScannedAt = now
  order.qrExpiresAt = now
  order.qrToken = null
  await order.save()
  return order
}

export async function payWithWallet(userId){
  // Load cart
  const cart = await Cart.findOne({ userId })
  if (!cart || !cart.items?.length) throw ApiError.badRequest('Cart is empty')
  // Check wallet balance
  const { Wallet, WalletTxn } = await import('../models/Wallet.js')
  let w = await Wallet.findOne({ userId })
  const balance = w?.balance || 0
  if (balance < (cart.total || 0)) {
    const shortage = Math.max(0, (cart.total || 0) - balance)
    const err = ApiError.badRequest('Insufficient wallet balance')
    err.details = { code: 'WALLET_INSUFFICIENT', shortage }
    throw err
  }
  // Validate stock
  const ids = cart.items.map(i=>i.itemId)
  const rows = await MenuItem.find({ _id: { $in: ids }, restaurantId: cart.restaurantId }).select('name quantity isAvailable')
  const map = new Map(rows.map(r=>[String(r._id), r]))
  for (const it of cart.items){
    const m = map.get(String(it.itemId))
    if (!m || !m.isAvailable || (m.quantity??0) < it.quantity) throw ApiError.badRequest('Item unavailable')
  }
  // Reserve stock
  const reserved = []
  try {
    for (const it of cart.items){
      const upd = await MenuItem.findOneAndUpdate(
        { _id: it.itemId, restaurantId: cart.restaurantId, isAvailable: true, quantity: { $gte: it.quantity } },
        { $inc: { quantity: -it.quantity } },
        { new: true }
      )
      if (!upd) throw ApiError.badRequest('Stock changed, please retry')
      reserved.push({ itemId: it.itemId, quantity: it.quantity })
    }
  } catch (e) {
    for (const r of reserved){ await MenuItem.updateOne({ _id: r.itemId }, { $inc: { quantity: r.quantity } }) }
    throw e
  }
  // Create order as paid
  const expSeconds = Math.floor(Date.now()/1000) + env.qrTtlMinutes*60
  const token = jwt.sign({ oid: '', rid: String(cart.restaurantId), n: crypto.randomBytes(6).toString('hex'), exp: expSeconds }, env.qrSecret)
  const order = await Order.create({
    userId,
    restaurantId: cart.restaurantId,
    items: cart.items,
    currency: cart.currency,
    subtotal: cart.subtotal,
    gstPercent: cart.gstPercent,
    gstAmount: cart.gstAmount,
    total: cart.total,
    status: 'paid',
    provider: 'wallet',
    reserved,
    qrToken: token,
    qrExpiresAt: new Date(expSeconds*1000)
  })
  // Fix token with order id signed
  const fixedToken = jwt.sign({ oid: String(order._id), rid: String(order.restaurantId), n: crypto.randomBytes(6).toString('hex'), exp: expSeconds }, env.qrSecret)
  order.qrToken = fixedToken
  await order.save()
  // Debit wallet
  w = await Wallet.findOneAndUpdate({ userId }, { $setOnInsert: { balance: 0 } }, { new: true, upsert: true })
  w.balance = (w.balance || 0) - (order.total || 0)
  await w.save()
  await WalletTxn.create({ userId, orderId: order._id, amount: order.total, type: 'debit', method: 'wallet', status: 'completed' })
  // Clear cart
  await Cart.deleteOne({ userId })
  return { orderId: order._id, amount: Math.round(order.total*100), currency: order.currency, keyId: null }
}

export async function expireOrderByUser(userId, orderId){
  const o = await Order.findOne({ _id: orderId, userId })
  if (!o) throw ApiError.notFound('Order not found')
  if (o.status !== 'paid') throw ApiError.badRequest('Order cannot be expired')
  // release stock
  for (const r of o.reserved){ await MenuItem.updateOne({ _id: r.itemId }, { $inc: { quantity: r.quantity } }) }
  o.status = 'expired'
  o.qrToken = null
  await o.save()
  return o
}

export async function refundOrder({ userId, orderId, method }){
  const o = await Order.findOne({ _id: orderId, userId })
  if (!o) throw ApiError.notFound('Order not found')
  if (!['expired','paid'].includes(o.status)) throw ApiError.badRequest('Refund not allowed for this status')
  if (method === 'wallet'){
    const { Wallet, WalletTxn } = await import('../models/Wallet.js')
    const w = await Wallet.findOneAndUpdate({ userId }, { $setOnInsert: { balance: 0 } }, { new: true, upsert: true })
    w.balance = (w.balance || 0) + (o.total || 0)
    await w.save()
    await WalletTxn.create({ userId, orderId, amount: o.total, type: 'credit', method: 'wallet', status: 'completed' })
    o.status = 'refunded'
    o.refundMethod = 'wallet'
    o.refundStatus = 'wallet_credited'
    await o.save()
    return o
  } else if (method === 'original'){
    if (!rz) throw ApiError.badRequest('Refund gateway not configured')
    if (!o.rzPaymentId) throw ApiError.badRequest('Payment reference missing')
    const refund = await rz.payments.refund(o.rzPaymentId, { amount: Math.round(o.total*100) })
    o.status = 'refunded'
    o.refundMethod = 'original'
    o.refundId = refund?.id
    o.refundStatus = refund?.status || 'processed'
    await o.save()
    return o
  }
  throw ApiError.badRequest('Invalid refund method')
}
