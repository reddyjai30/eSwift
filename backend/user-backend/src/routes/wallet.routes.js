import { Router } from 'express'
import { userAuth } from '../middlewares/auth.js'
import { getWallet, listTxns } from '../controllers/wallet.controller.js'

const r = Router()
r.use(userAuth)
r.get('/', getWallet)
r.get('/txns', listTxns)

export default r

