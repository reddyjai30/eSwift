import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import morgan from 'morgan'
import hpp from 'hpp'
import { env } from './config/env.js'
import routes from './routes/index.js'
import { errorHandler, notFound } from './middlewares/error.js'
import { rateLimit } from './middlewares/rateLimiter.js'

const app = express()
app.use(helmet())
app.use(cors({ origin: env.corsOrigin, credentials: true }))
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(hpp())
app.use(morgan('dev'))
app.use(rateLimit)

app.get('/', (_req, res) => res.json({ success: true, message: 'eSwift User API up' }))
app.use('/api', routes)

app.use(notFound)
app.use(errorHandler)

export default app

