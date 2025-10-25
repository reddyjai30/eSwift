import { Router } from 'express'
import { userAuth } from '../middlewares/auth.js'
import { getProfile, updateProfile } from '../controllers/user.controller.js'

const r = Router()
r.use(userAuth)
r.get('/profile', getProfile)
r.patch('/profile', updateProfile)

export default r

