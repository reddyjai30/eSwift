import mongoose from 'mongoose'
import { env } from './env.js'

export const adminConn = mongoose.createConnection(env.adminMongoUri, {
  autoIndex: env.nodeEnv !== 'production'
})

adminConn.on('connected', ()=> console.log('User API connected to admin DB'))
adminConn.on('error', (e)=> console.error('Admin DB connection error', e))

