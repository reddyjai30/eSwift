import { Router } from 'express'
import { userAuth } from '../middlewares/auth.js'
import { listOrders, getOrder, getOrderQr, activateQr, invoicePdf, invoicePublic, expireOrder, refundOrderController } from '../controllers/order.controller.js'

const r = Router()
r.post('/qr/activate', activateQr) // public scan endpoint
r.get('/invoice-public/:token', invoicePublic) // public invoice by signed token
r.get('/:id/invoice.pdf', invoicePdf) // public invoice by order id
r.use(userAuth)
r.get('/', listOrders)
r.get('/:id', getOrder)
r.get('/:id/qr', getOrderQr)
r.post('/:id/expire', expireOrder)
r.post('/:id/refund', refundOrderController)

export default r
