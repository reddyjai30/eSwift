import { Router } from 'express'
import { userAuth } from '../middlewares/auth.js'
import { listRestaurants, listMenuItems } from '../controllers/restaurant.controller.js'

const r = Router()
r.use(userAuth)
r.get('/', listRestaurants)
r.get('/:id/menu', listMenuItems)

export default r

