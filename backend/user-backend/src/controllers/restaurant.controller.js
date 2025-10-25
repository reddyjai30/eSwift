import { ok } from '../utils/ApiResponse.js'
import { Restaurant } from '../modelsAdmin/Restaurant.js'
import { MenuItem } from '../modelsAdmin/MenuItem.js'
import ApiError from '../utils/ApiError.js'

export async function listRestaurants(_req, res, next){
  try {
    const rows = await Restaurant.find({ isActive: true }).sort({ name: 1 }).select('name address logoUrl')
    res.json(ok(rows))
  } catch(e){ next(e) }
}

export async function listMenuItems(req, res, next){
  try {
    const { id } = req.params
    const r = await Restaurant.findById(id).lean()
    if (!r || r.isActive === false) return next(ApiError.notFound('Restaurant not found'))
    const includeUnavailable = String(req.query.includeUnavailable || '1').toLowerCase() === '1' || String(req.query.includeUnavailable || '1').toLowerCase() === 'true'

    const docs = await MenuItem.find({ restaurantId: id })
      .sort({ category: 1, name: 1 })
      .select('name price category imageUrl quantity isAvailable')
      .lean()

    let items = docs.map(d => {
      const qty = d.quantity ?? 0
      const baseAvailable = d.isAvailable !== false // treat undefined as true
      const canOrder = baseAvailable && qty > 0
      const lowStock = canOrder && qty <= 5
      const outOfStock = qty <= 0
      let status = 'available'
      if (!baseAvailable) status = 'unavailable'
      else if (outOfStock) status = 'out_of_stock'
      else if (lowStock) status = 'low_stock'
      const stockMessage = lowStock ? `Hurry up! Only ${qty} left` : null
      return {
        _id: d._id,
        name: d.name,
        price: d.price,
        category: d.category,
        imageUrl: d.imageUrl,
        quantity: qty,
        // expose effective availability to client: quantity 0 forces false
        isAvailable: canOrder, // quantity==0 -> false, or if baseAvailable false -> false
        canOrder,
        status,
        stockMessage,
      }
    })

    if (!includeUnavailable) {
      items = items.filter(i => i.canOrder)
    }

    res.json(ok({ restaurant: { _id: r._id, name: r.name, address: r.address, logoUrl: r.logoUrl }, items }))
  } catch(e){ next(e) }
}
