import { Router } from 'express'
import { userAuth } from '../middlewares/auth.js'
import { createOrder, verify, cancel, walletPay } from '../controllers/payment.controller.js'

const r = Router()
r.use(userAuth)
r.post('/create-order', createOrder)
r.post('/verify', verify)
r.post('/cancel', cancel)
r.post('/wallet', walletPay)

export default r
