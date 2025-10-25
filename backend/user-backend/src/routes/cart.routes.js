import { Router } from 'express'
import { userAuth } from '../middlewares/auth.js'
import { getCart, clearCart, addItems, updateItems, removeItem } from '../controllers/cart.controller.js'

const r = Router()
r.use(userAuth)
r.get('/', getCart)
r.post('/items', addItems) // add single or multiple items
r.patch('/items', updateItems) // change quantities
r.delete('/', clearCart)
r.delete('/items/:itemId', removeItem)

export default r

