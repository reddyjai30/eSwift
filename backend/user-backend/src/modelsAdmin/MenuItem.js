import { Schema } from 'mongoose'
import { adminConn } from '../config/adminMongo.js'

const MenuItemSchema = new Schema({
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', index: true },
  name: String,
  price: Number,
  isAvailable: { type: Boolean, default: true },
  quantity: { type: Number, default: 0 },
  category: String,
  imageUrl: String
}, { timestamps: true, collection: 'menuitems' })

export const MenuItem = adminConn.model('MenuItem', MenuItemSchema)

