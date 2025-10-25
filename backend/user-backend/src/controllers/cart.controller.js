import { ok } from '../utils/ApiResponse.js'
import ApiError from '../utils/ApiError.js'
import * as svc from '../services/cart.service.js'

export async function getCart(req, res, next){
  try { const c = await svc.getCart(req.user.sub); res.json(ok(c || { items: [], total: 0, gstAmount:0, subtotal:0, currency:'INR' })) } catch(e){ next(e) }
}

export async function clearCart(req, res, next){
  try { await svc.clearCart(req.user.sub); res.json(ok(true, 'Cart cleared')) } catch(e){ next(e) }
}

export async function addItems(req, res, next){
  try {
    const { restaurantId, items, replace } = req.body || {}
    if (!restaurantId) return next(ApiError.badRequest('restaurantId required'))
    const cart = await svc.addItems({ userId: req.user.sub, restaurantId, items, replace: !!replace })
    res.json(ok(cart, 'Items added'))
  } catch(e){ next(e) }
}

export async function updateItems(req, res, next){
  try {
    const { items } = req.body || {}
    const cart = await svc.updateItems({ userId: req.user.sub, items })
    res.json(ok(cart, 'Cart updated'))
  } catch(e){ next(e) }
}

export async function removeItem(req, res, next){
  try { const cart = await svc.removeItem({ userId: req.user.sub, itemId: req.params.itemId }); res.json(ok(cart, 'Item removed')) } catch(e){ next(e) }
}

