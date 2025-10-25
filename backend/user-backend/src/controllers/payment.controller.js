import { ok } from '../utils/ApiResponse.js'
import ApiError from '../utils/ApiError.js'
import { createOrderFromCart, verifyPaymentSignature, cancelAndRelease, payWithWallet } from '../services/payment.service.js'

export async function createOrder(req, res, next){
  try {
    const data = await createOrderFromCart(req.user.sub)
    res.json(ok(data, 'Razorpay order created'))
  } catch(e){ next(e) }
}

export async function verify(req, res, next){
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body || {}
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) return next(ApiError.badRequest('Missing fields'))
    const ord = await verifyPaymentSignature({ razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId })
    res.json(ok({ orderId: ord._id, status: ord.status }, 'Payment verified'))
  } catch(e){ next(e) }
}

export async function cancel(req, res, next){
  try {
    const { orderId } = req.body || {}
    if (!orderId) return next(ApiError.badRequest('orderId required'))
    const ord = await cancelAndRelease({ orderId })
    res.json(ok({ orderId: ord._id, status: ord.status }, 'Order cancelled'))
  } catch(e){ next(e) }
}

export async function walletPay(req, res, next){
  try {
    const data = await payWithWallet(req.user.sub)
    res.json(ok(data, 'Wallet payment successful'))
  } catch(e){ next(e) }
}
