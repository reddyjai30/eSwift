import { useEffect, useState } from 'react'
import { api } from '../utils/api.js'
import { useNavigate } from 'react-router-dom'
import OrderCardFigma from '../components/OrderCardFigma.jsx'

export default function Orders(){
  const [rows, setRows] = useState(null)
  const navigate = useNavigate()
  useEffect(()=>{ (async()=>{ const r = await api.get('/api/orders'); setRows(r.data) })() },[])
  return (
    <div>
      <h2 style={{ fontWeight:700, fontSize:20, marginBottom:12 }}>Your Orders</h2>
      {!rows ? (
        Array.from({length:4}).map((_,i)=> (<div key={i} style={{ height:72, background:'var(--bg-paper)', borderRadius:12, border:'1px solid var(--divider)', marginBottom:12 }} />))
      ) : rows.length===0 ? (
        <div style={{ color:'var(--text-secondary)' }}>No orders yet.</div>
      ) : (
        <div style={{ display:'grid', gap:12 }}>
          {rows.map(o => (
            <OrderCardFigma key={o._id} order={o} onClick={()=>navigate(`/orders/${o._id}`)} />
          ))}
        </div>
      )}
    </div>
  )
}
