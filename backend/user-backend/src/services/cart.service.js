import ApiError from '../utils/ApiError.js'
import { Cart } from '../models/Cart.js'
import { MenuItem } from '../modelsAdmin/MenuItem.js'
import { env } from '../config/env.js'

function calcTotals(cart){
  const subtotal = cart.items.reduce((s, it) => s + it.price * it.quantity, 0)
  const gstPercent = env.gstPercent
  const gstAmount = Math.round(subtotal * gstPercent) / 100 // round to paise later
  const total = subtotal + gstAmount
  cart.subtotal = Math.round(subtotal * 100) / 100
  cart.gstPercent = gstPercent
  cart.gstAmount = Math.round(gstAmount * 100) / 100
  cart.total = Math.round(total * 100) / 100
  return cart
}

async function fetchMenuMap(restaurantId, ids){
  const rows = await MenuItem.find({ _id: { $in: ids }, restaurantId }).select('name price quantity isAvailable imageUrl category').lean()
  const map = new Map(rows.map(r => [String(r._id), r]))
  return map
}

export async function getCart(userId){
  const c = await Cart.findOne({ userId })
  return c
}

export async function clearCart(userId){
  await Cart.deleteOne({ userId })
  return true
}

export async function addItems({ userId, restaurantId, items, replace }){
  if (!Array.isArray(items) || items.length === 0) throw ApiError.badRequest('items required')
  const ids = items.map(i => i.itemId)
  const menuMap = await fetchMenuMap(restaurantId, ids)
  // validate
  for (const it of items){
    const m = menuMap.get(String(it.itemId))
    if (!m) throw ApiError.badRequest('Invalid item in request')
    if (!m.isAvailable || (m.quantity ?? 0) <= 0) throw ApiError.badRequest(`${m.name} is unavailable`)
    if (it.quantity < 1) throw ApiError.badRequest('Quantity must be >= 1')
    if (it.quantity > m.quantity) throw ApiError.badRequest(`${m.name} has only ${m.quantity} left`)
  }

  let cart = await Cart.findOne({ userId })
  if (cart && String(cart.restaurantId) !== String(restaurantId)){
    if (!replace) {
      throw new ApiError(400, 'Cart belongs to another restaurant', { code: 'CART_RESTAURANT_MISMATCH', currentRestaurantId: String(cart.restaurantId) })
    } else {
      await Cart.deleteOne({ userId })
      cart = null
    }
  }

  if (!cart){
    cart = new Cart({ userId, restaurantId, items: [], currency: 'INR' })
  }

  // merge items
  for (const it of items){
    const m = menuMap.get(String(it.itemId))
    const existing = cart.items.find(ci => String(ci.itemId) === String(it.itemId))
    const newQty = Math.min((existing?.quantity || 0) + it.quantity, m.quantity || 0)
    if (existing){
      existing.quantity = newQty
      existing.price = m.price
      existing.name = m.name
      existing.imageUrl = m.imageUrl
      existing.category = m.category
    } else {
      cart.items.push({ itemId: it.itemId, name: m.name, price: m.price, quantity: newQty, imageUrl: m.imageUrl, category: m.category })
    }
  }

  calcTotals(cart)
  await cart.save()
  return cart
}

export async function updateItems({ userId, items }){
  if (!Array.isArray(items) || items.length === 0) throw ApiError.badRequest('items required')
  const cart = await Cart.findOne({ userId })
  if (!cart) throw ApiError.badRequest('Cart empty')
  const ids = items.map(i => i.itemId)
  const menuMap = await fetchMenuMap(cart.restaurantId, ids)

  for (const it of items){
    const m = menuMap.get(String(it.itemId))
    if (!m) continue
    const existing = cart.items.find(ci => String(ci.itemId) === String(it.itemId))
    if (!existing) continue
    const qty = Math.max(0, Math.min(Number(it.quantity || 0), m.quantity || 0))
    if (qty === 0){
      cart.items = cart.items.filter(ci => String(ci.itemId) !== String(it.itemId))
    } else {
      existing.quantity = qty
      existing.price = m.price
    }
  }
  calcTotals(cart)
  await cart.save()
  return cart
}

export async function removeItem({ userId, itemId }){
  const cart = await Cart.findOne({ userId })
  if (!cart) return true
  cart.items = cart.items.filter(ci => String(ci.itemId) !== String(itemId))
  calcTotals(cart)
  await cart.save()
  return cart
}

