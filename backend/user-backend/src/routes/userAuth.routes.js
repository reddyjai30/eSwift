import { Router } from 'express'
import { loginStart, loginVerify, signupStart, signupVerify, me } from '../controllers/auth.controller.js'
import { userAuth } from '../middlewares/auth.js'

const r = Router()
r.post('/signup/start', signupStart)
r.post('/signup/verify', signupVerify)
r.post('/login/start', loginStart)
r.post('/login/verify', loginVerify)
r.get('/me', userAuth, me)

export default r

