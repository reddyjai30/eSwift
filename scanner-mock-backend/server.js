import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import fetch from 'node-fetch'

const PORT = process.env.PORT || 5055
const USER_API = process.env.USER_API || 'http://localhost:5002'

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.post('/scan', async (req,res)=>{
  const { token } = req.body || {}
  if (!token) return res.status(400).json({ success:false, message:'token required' })
  const r = await fetch(`${USER_API}/api/orders/qr/activate`, {
    method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ token })
  })
  const j = await r.json()
  if (!r.ok) return res.status(r.status).json(j)
  console.log('PRINT BILL PLACEHOLDER: orderId', j?.data?.orderId)
  res.json(j)
})

app.listen(PORT, ()=> console.log(`Scanner mock backend on :${PORT}`))

