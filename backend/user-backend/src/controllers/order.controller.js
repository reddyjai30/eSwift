import { ok } from '../utils/ApiResponse.js'
import ApiError from '../utils/ApiError.js'
import { Order } from '../models/Order.js'
import { activateByQrToken, expireOrderByUser, refundOrder } from '../services/payment.service.js'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import PDFDocument from 'pdfkit'

export async function listOrders(req, res, next){
  try {
    const rows = await Order.find({ userId: req.user.sub }).sort({ createdAt: -1 })
    res.json(ok(rows))
  } catch(e){ next(e) }
}

export async function getOrder(req, res, next){
  try {
    const o = await Order.findOne({ _id: req.params.id, userId: req.user.sub })
    if (!o) return next(ApiError.notFound('Order not found'))
    res.json(ok(o))
  } catch(e){ next(e) }
}

export async function getOrderQr(req, res, next){
  try {
    const o = await Order.findOne({ _id: req.params.id, userId: req.user.sub })
    if (!o) return next(ApiError.notFound('Order not found'))
    if (o.status !== 'paid' || !o.qrToken) return next(ApiError.badRequest('Order not scannable'))
    res.json(ok({ token: o.qrToken, expiresAt: o.qrExpiresAt }))
  } catch(e){ next(e) }
}

// Public scan endpoint (restaurant device)
export async function activateQr(req, res, next){
  try {
    const { token } = req.body || {}
    if (!token) return next(ApiError.badRequest('token required'))
    const o = await activateByQrToken(token)
    // Return a short-lived public invoice token so the scanner can download invoice without user auth
    const invToken = jwt.sign({ oid: String(o._id), typ: 'inv', exp: Math.floor(Date.now()/1000) + 10*60 }, env.qrSecret)
    res.json(ok({ orderId: o._id, status: o.status, deliveredAt: o.deliveredAt, invoiceToken: invToken }))
  } catch(e){ next(e) }
}

export async function invoicePublic(req, res, next){
  try {
    const { token } = req.params
    let payload
    try { payload = jwt.verify(token, env.qrSecret) } catch { return next(ApiError.badRequest('Invalid or expired token')) }
    if (payload.typ !== 'inv') return next(ApiError.badRequest('Invalid token type'))
    const o = await Order.findById(payload.oid)
    if (!o) return next(ApiError.notFound('Order not found'))
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `inline; filename="order-${o._id}.pdf"`)
    const doc = new PDFDocument({ size: 'A4', margin: 50 })
    doc.pipe(res)
    doc.fontSize(18).text('eSwift — Order Invoice', { align: 'center' })
    doc.moveDown(0.5)
    doc.fontSize(10).text(`Order ID: ${o._id}`)
    doc.text(`Date: ${new Date(o.createdAt).toLocaleString()}`)
    doc.text(`Status: ${o.status}`)
    doc.moveDown()
    doc.fontSize(12).text('Items')
    doc.moveDown(0.5)
    o.items.forEach(it => { doc.fontSize(11).text(`${it.name} x ${it.quantity} — ₹ ${it.price*it.quantity}`) })
    doc.moveDown()
    doc.fontSize(11).text(`Subtotal: ₹ ${o.subtotal}`)
    doc.text(`GST (${o.gstPercent}%): ₹ ${o.gstAmount}`)
    doc.fontSize(13).text(`Total: ₹ ${o.total}`, { align: 'right' })
    doc.end()
  } catch(e){ next(e) }
}

export async function invoicePdf(req, res, next){
  try {
    // Public: allow invoice by orderId without auth
    const o = await Order.findById(req.params.id)
    if (!o) return next(ApiError.notFound('Order not found'))
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `inline; filename="order-${o._id}.pdf"`)
    const doc = new PDFDocument({ size: 'A4', margin: 50 })
    doc.pipe(res)
    doc.fontSize(18).text('eSwift — Order Invoice', { align: 'center' })
    doc.moveDown(0.5)
    doc.fontSize(10).text(`Order ID: ${o._id}`)
    doc.text(`Date: ${new Date(o.createdAt).toLocaleString()}`)
    doc.text(`Status: ${o.status}`)
    doc.moveDown()
    doc.fontSize(12).text('Items')
    doc.moveDown(0.5)
    o.items.forEach(it => {
      doc.fontSize(11).text(`${it.name} x ${it.quantity} — ₹ ${it.price*it.quantity}`)
    })
    doc.moveDown()
    doc.fontSize(11).text(`Subtotal: ₹ ${o.subtotal}`)
    doc.text(`GST (${o.gstPercent}%): ₹ ${o.gstAmount}`)
    doc.fontSize(13).text(`Total: ₹ ${o.total}`, { align: 'right' })
    doc.end()
  } catch(e){ next(e) }
}

export async function expireOrder(req, res, next){
  try {
    const o = await expireOrderByUser(req.user.sub, req.params.id)
    res.json(ok({ orderId: o._id, status: o.status }))
  } catch(e){ next(e) }
}

export async function refundOrderController(req, res, next){
  try {
    const { method } = req.body || {}
    if (!method) return next(ApiError.badRequest('method required'))
    const o = await refundOrder({ userId: req.user.sub, orderId: req.params.id, method })
    res.json(ok({ orderId: o._id, status: o.status, refundStatus: o.refundStatus, refundMethod: o.refundMethod }))
  } catch(e){ next(e) }
}
