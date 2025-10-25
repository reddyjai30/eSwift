import { Schema } from 'mongoose'
import { adminConn } from '../config/adminMongo.js'

const RestaurantSchema = new Schema({
  name: String,
  address: String,
  isActive: { type: Boolean, default: true },
  logoUrl: String
}, { timestamps: true, collection: 'restaurants' })

export const Restaurant = adminConn.model('Restaurant', RestaurantSchema)

