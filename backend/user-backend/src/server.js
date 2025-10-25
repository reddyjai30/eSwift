import { env } from './config/env.js'
import { connectMongo } from './config/mongo.js'
import app from './app.js'
import { releaseExpiredReservations, expirePaidAndRefund } from './services/payment.service.js'

(async () => {
  await connectMongo()
  app.listen(env.port, () => console.log(`User API on http://localhost:${env.port}`))
  // background task to release expired reservations
  setInterval(() => {
    releaseExpiredReservations().catch(()=>{})
    expirePaidAndRefund().catch(()=>{})
  }, 60 * 1000)
})()
