import { Router } from 'express'
import authRoutes from './userAuth.routes.js'
import restaurants from './restaurants.routes.js'
import cart from './cart.routes.js'
import user from './user.routes.js'
import payments from './payments.routes.js'
import orders from './orders.routes.js'
import wallet from './wallet.routes.js'

const r = Router()
r.use('/auth', authRoutes)
r.use('/restaurants', restaurants)
r.use('/cart', cart)
r.use('/user', user)
r.use('/payments', payments)
r.use('/orders', orders)
r.use('/wallet', wallet)

export default r
