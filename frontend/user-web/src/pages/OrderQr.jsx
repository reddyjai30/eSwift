import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../utils/api.js'
import QRCode from 'react-qr-code'

export default function OrderQr(){
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [qr, setQr] = useState(null)
  const [now, setNow] = useState(Date.now())
  const [autoExpired, setAutoExpired] = useState(false)
  const [refundStage, setRefundStage] = useState('idle') // idle|initiated|processing|success|error
  const [refundMethod, setRefundMethod] = useState(null)
  const [ttl0, setTtl0] = useState(null) // initial seconds for countdown ring
  useEffect(()=>{ const t = setInterval(()=>setNow(Date.now()), 1000); return ()=>clearInterval(t) },[])
  useEffect(()=>{ setAutoExpired(false); (async()=>{ const o = await api.get(`/api/orders/${id}`); setOrder(o.data); try{ const q = await api.get(`/api/orders/${id}/qr`); setQr(q.data) }catch(e){ setQr(null) } })() },[id])
  // poll order status while paid
  useEffect(()=>{
    if (!order || order.status!=='paid') return
    const t = setInterval(async ()=>{ const o = await api.get(`/api/orders/${id}`); setOrder(o.data) }, 3000)
    return ()=> clearInterval(t)
  },[order,id])
  // refresh QR data every 30s to keep UI in sync
  useEffect(()=>{
    if (!order || order.status!=='paid') return
    const t = setInterval(async ()=>{ try{ const q = await api.get(`/api/orders/${id}/qr`); setQr(q.data) } catch{} }, 30000)
    return ()=> clearInterval(t)
  },[order,id])

  // compute countdown and status color regardless of order presence
  const expiresIn = qr?.expiresAt ? Math.max(0, Math.floor((new Date(qr.expiresAt).getTime() - now)/1000)) : 0
  const mm = String(Math.floor(expiresIn/60)).padStart(2,'0')
  const ss = String(expiresIn%60).padStart(2,'0')
  const statusLabelColor = useMemo(()=>{
    if (order?.status==='delivered') return { bg:'rgba(34,197,94,.15)', border:'rgba(34,197,94,.3)', color:'#22C55E' }
    if (order?.status==='paid') return { bg:'rgba(245,158,11,.15)', border:'rgba(245,158,11,.3)', color:'#F59E0B' }
    if (order?.status==='refunded') return { bg:'rgba(239,68,68,.15)', border:'rgba(239,68,68,.3)', color:'#EF4444' }
    if (order?.status==='expired') return { bg:'rgba(156,163,175,.15)', border:'rgba(156,163,175,.3)', color:'#9CA3AF' }
    return { bg:'rgba(156,163,175,.15)', border:'rgba(156,163,175,.3)', color:'var(--text-secondary)' }
  },[order])

  const onExpire = async () => {
    try { await api.post(`/api/orders/${id}/expire`, {}); const o = await api.get(`/api/orders/${id}`); setOrder(o.data); setQr(null) } catch(e){}
  }
  // auto-expire when timer hits 0 — keep hook order stable
  useEffect(()=>{
    if (!order || order.status !== 'paid') return
    if (qr?.expiresAt && expiresIn === 0 && !autoExpired){ setAutoExpired(true); onExpire() }
  },[expiresIn, order, qr, autoExpired])
  // set ttl0 when we first get QR
  useEffect(()=>{
    if (qr?.expiresAt && ttl0==null){
      const left = Math.max(0, Math.floor((new Date(qr.expiresAt).getTime() - Date.now())/1000))
      setTtl0(left || 1)
    }
  },[qr, ttl0])
  if (!order) return null
  const refund = async (method) => {
    try {
      setRefundMethod(method)
      setRefundStage('initiated')
      // short delay to show stage change
      await new Promise(r => setTimeout(r, 400))
      setRefundStage('processing')
      const r = await api.post(`/api/orders/${id}/refund`, { method })
      const o = await api.get(`/api/orders/${id}`)
      setOrder(o.data)
      setRefundStage('success')
    } catch(e){ setRefundStage('error') }
  }

  const fmt = (n) => `₹ ${Number(n||0).toFixed(2)}`
  const ring = (()=>{
    const size = 240, stroke = 8
    const r = (size - stroke)/2
    const circ = 2*Math.PI*r
    const pct = ttl0 ? Math.max(0, Math.min(1, expiresIn / ttl0)) : 0
    const dash = circ * pct
    return { size, stroke, r, circ, dash }
  })()

  return (
    <div>
      <h2 style={{ fontWeight:700, fontSize:20, marginBottom:8 }}>Order</h2>
      <div style={{ display:'inline-flex', marginBottom:12 }}>
        <span style={{ padding:'6px 10px', borderRadius:999, border:`1px solid ${statusLabelColor.border}`, background: statusLabelColor.bg, color: statusLabelColor.color, fontSize:12, fontWeight:700 }}>{order.status.toUpperCase()}</span>
      </div>

      {/* Bill summary */}
      <div style={{ background:'var(--bg-paper)', border:'1px solid var(--divider)', borderRadius:12, boxShadow:'var(--e-1)', marginBottom:12 }}>
        <div style={{ padding:16, fontWeight:600 }}>Bill</div>
        <div style={{ padding:16, paddingTop:0 }}>
          <div style={{ display:'grid', gap:8 }}>
            {order.items.map((it,i)=> (
              <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
                {it.imageUrl ? (<img src={it.imageUrl} alt='' style={{ width:36, height:36, objectFit:'cover', borderRadius:8 }} />) : (<div style={{ width:36, height:36, borderRadius:8, background:'var(--surface)' }} />)}
                <div style={{ flex:1, marginLeft:8 }}>{it.name} x {it.quantity}</div>
                <div className="tabular-nums">{fmt(it.price*it.quantity)}</div>
              </div>
            ))}
          </div>
          <div style={{ borderTop:'1px solid var(--divider)', margin:'10px 0' }} />
          <div style={{ display:'grid', gap:4 }}>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <span>Subtotal</span>
              <span className="tabular-nums">{fmt(order.subtotal)}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <span>GST ({order.gstPercent}%)</span>
              <span className="tabular-nums">{fmt(order.gstAmount)}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:6 }}>
              <span style={{ fontWeight:700 }}>Total</span>
              <span className="tabular-nums" style={{ fontWeight:700 }}>{fmt(order.total)}</span>
            </div>
            <div style={{ color:'var(--text-secondary)', fontSize:12 }}>Payment: {order.provider==='wallet' ? 'Wallet' : 'Razorpay'}</div>
          </div>
        </div>
      </div>

      {/* QR states */}
      {order.status==='paid' && qr ? (
        <div style={{ background:'var(--bg-paper)', border:'1px solid var(--divider)', borderRadius:12, boxShadow:'var(--e-1)', textAlign:'center', padding:16 }}>
          <div style={{ marginBottom:8 }}>Show this QR at the counter</div>
          <div style={{ display:'flex', justifyContent:'center', position:'relative', width:240, height:240, margin:'0 auto' }}>
            <svg width={ring.size} height={ring.size} style={{ position:'absolute', transform:'rotate(-90deg)' }}>
              <circle cx={ring.size/2} cy={ring.size/2} r={ring.r} stroke="var(--surface)" strokeWidth={ring.stroke} fill="none" />
              <circle cx={ring.size/2} cy={ring.size/2} r={ring.r}
                stroke="var(--primary)" strokeWidth={ring.stroke} fill="none"
                strokeLinecap="round" strokeDasharray={`${ring.dash} ${ring.circ}`} />
            </svg>
            <div style={{ margin:'auto' }}>
              <QRCode value={qr.token} size={200} />
            </div>
          </div>
          <div style={{ marginTop:8 }} className="tabular-nums">Expires in {mm}:{ss}</div>
          <button onClick={()=>{ const link=document.createElement('a'); link.href = `data:image/svg+xml,${encodeURIComponent(document.querySelector('svg + div svg')?.outerHTML || '')}`; link.download = `eswift-order-${id}.svg`; link.click() }}
            style={{ marginTop:10, padding:'10px 12px', borderRadius:10, border:'1px solid var(--divider)', background:'transparent', fontWeight:600 }}>Download QR</button>
        </div>
      ) : order.status==='delivered' ? (
        <div style={{ background:'var(--bg-paper)', border:'1px solid var(--divider)', borderRadius:12, boxShadow:'var(--e-1)', textAlign:'center', padding:16 }}>
          <div style={{ fontWeight:700, marginBottom:8 }}>Thank you for reaching the restaurant!</div>
          <div style={{ color:'var(--text-secondary)' }}>Please collect your bill at the counter.</div>
          <button onClick={()=>window.open(`/api/orders/${id}/invoice.pdf`, '_blank')}
            style={{ marginTop:12, padding:'10px 12px', borderRadius:10, border:'1px solid var(--divider)', background:'transparent', fontWeight:600 }}>Download Invoice PDF</button>
        </div>
      ) : order.status==='expired' ? (
        <div style={{ background:'var(--bg-paper)', border:'1px solid var(--divider)', borderRadius:12, boxShadow:'var(--e-1)', textAlign:'center', padding:16 }}>
          <div style={{ fontWeight:700, marginBottom:8 }}>Time’s up — QR expired</div>
          <div style={{ color:'var(--text-secondary)' }}>Choose a refund option:</div>
          <div style={{ display:'flex', gap:8, justifyContent:'center', marginTop:12 }}>
            <button disabled={refundStage==='processing'} onClick={()=>refund('wallet')} style={{ padding:'10px 12px', borderRadius:10, border:'none', background:'var(--gradient-primary)', color:'#fff', fontWeight:700, boxShadow:'var(--e-2)' }}>Refund to Wallet</button>
            <button disabled={refundStage==='processing'} onClick={()=>refund('original')} style={{ padding:'10px 12px', borderRadius:10, border:'1px solid var(--divider)', background:'transparent', fontWeight:700 }}>Refund to Original</button>
          </div>
          {refundStage!=='idle' && (
            <div style={{ maxWidth:380, margin:'12px auto 0', textAlign:'left' }}>
              <div style={{ fontSize:12, color:'var(--text-secondary)' }}>Refund {refundMethod==='wallet' ? 'to Wallet' : 'to Original'}:</div>
              <div style={{ display:'grid', gap:6, marginTop:6 }}>
                <div style={{ opacity: refundStage!=='idle' ? 1 : .4 }}>• Initiated</div>
                <div>
                  <div style={{ marginBottom:6, opacity: (refundStage==='success' || refundStage==='processing') ? 1 : .4 }}>• In progress</div>
                  {refundStage==='processing' && (
                    <div style={{ height:6, borderRadius:6, background:'var(--surface)', overflow:'hidden' }}>
                      <div style={{ width:'60%', height:'100%', background:'var(--primary)', animation:'progressAnim 1.2s ease-in-out infinite' }} />
                    </div>
                  )}
                </div>
                {refundStage==='success' && (
                  <div style={{ color:'#22C55E', fontWeight:600 }}>✓ Successful</div>
                )}
                {refundStage==='error' && (
                  <div style={{ color:'#EF4444', fontWeight:600 }}>× Failed — try again</div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : order.status==='refunded' ? (
        <div style={{ background:'var(--bg-paper)', border:'1px solid var(--divider)', borderRadius:12, boxShadow:'var(--e-1)', textAlign:'center', padding:16 }}>
          <div style={{ fontWeight:700, marginBottom:8 }}>Refund Successful</div>
          <div style={{ color:'var(--text-secondary)' }}>Amount has been {order.refundMethod==='wallet' ? 'credited to your wallet' : 'refunded to your original payment method'}.</div>
        </div>
      ) : (
        <div style={{ color:'var(--text-secondary)' }}>QR not available for this order.</div>
      )}
      <style>{`@keyframes progressAnim{0%{transform:translateX(-60%)}50%{transform:translateX(-10%)}100%{transform:translateX(100%)}}`}</style>
    </div>
  )
}
