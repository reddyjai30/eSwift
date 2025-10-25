import { useEffect, useState } from 'react'
import { api } from '../utils/api.js'

export default function Wallet(){
  const [balance, setBalance] = useState(0)
  const [txns, setTxns] = useState([])
  const [open, setOpen] = useState(false)
  const [selectedTxn, setSelectedTxn] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(()=>{ (async()=>{
    try { const w = await api.get('/api/wallet'); setBalance(w.data.balance||0) } catch {}
    try { const t = await api.get('/api/wallet/txns'); setTxns(t.data||[]) } catch {}
  })() },[])

  async function openTxn(tx){
    setSelectedTxn(tx); setSelectedOrder(null); setOpen(true)
    if (tx.orderId){
      try { const o = await api.get(`/api/orders/${tx.orderId}`); setSelectedOrder(o.data) } catch {}
    }
  }

  const fmt = (n) => `₹ ${Number(n||0).toFixed(2)}`

  return (
    <div>
      <h2 style={{ fontWeight:700, fontSize:20, marginBottom:12 }}>Wallet</h2>
      <div style={{ background:'var(--bg-paper)', border:'1px solid var(--divider)', borderRadius:12, padding:16, marginBottom:12, boxShadow:'var(--e-1)' }}>
        <div style={{ color:'var(--text-secondary)' }}>Balance</div>
        <div style={{ fontSize:28, fontWeight:700 }} className="tabular-nums">{fmt(balance)}</div>
      </div>

      <div style={{ fontWeight:600, marginBottom:8 }}>Transactions</div>
      <div style={{ background:'var(--bg-paper)', border:'1px solid var(--divider)', borderRadius:12, boxShadow:'var(--e-1)' }}>
        {txns.map(tx => (
          <button key={tx._id} onClick={()=>openTxn(tx)} style={{ width:'100%', textAlign:'left', padding:12, display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid var(--divider)', background:'transparent' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:999, background: tx.type==='credit' ? 'rgba(34,197,94,.15)' : 'rgba(239,68,68,.15)', color: tx.type==='credit' ? '#22C55E' : '#EF4444', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>
                {tx.type==='credit' ? '+' : '-'}
              </div>
              <div>
                <div style={{ fontWeight:700, color: tx.type==='credit' ? '#22C55E' : '#EF4444' }} className="tabular-nums">{tx.type==='credit' ? '+ ' : '- '}{fmt(tx.amount)}</div>
                <div style={{ fontSize:12, color:'var(--text-secondary)' }}>{new Date(tx.createdAt).toLocaleString()}</div>
              </div>
            </div>
            <span style={{ fontSize:12, padding:'4px 8px', borderRadius:999, border:'1px solid var(--divider)', color:'var(--text-secondary)' }}>{(tx.method||'wallet').toUpperCase()}</span>
          </button>
        ))}
        {txns.length===0 && (
          <div style={{ padding:16, color:'var(--text-secondary)' }}>No transactions yet.</div>
        )}
      </div>

      {/* Dialog */}
      {open && (
        <div style={{ position:'fixed', inset:0, zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,.35)' }} onClick={()=>setOpen(false)}>
          <div style={{ width:'min(92vw, 560px)', background:'var(--bg-paper)', borderRadius:12, boxShadow:'var(--e-3)', border:'1px solid var(--divider)' }} onClick={e=>e.stopPropagation()}>
            <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--divider)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ fontWeight:700 }}>Transaction Details</div>
              <button onClick={()=>setOpen(false)} style={{ border:'none', background:'transparent', fontSize:18, lineHeight:1, color:'var(--text-secondary)' }}>×</button>
            </div>
            <div style={{ padding:16, maxHeight:'70vh', overflow:'auto' }}>
              {selectedTxn && (
                <div style={{ marginBottom:12 }}>
                  <div style={{ fontWeight:700, fontSize:18 }}>{selectedTxn.type==='credit' ? 'Credit' : 'Debit'} • {fmt(selectedTxn.amount)}</div>
                  <div style={{ fontSize:12, color:'var(--text-secondary)' }}>{new Date(selectedTxn.createdAt).toLocaleString()} • {(selectedTxn.method||'WALLET').toUpperCase()}</div>
                </div>
              )}
              {selectedTxn && !selectedTxn.orderId ? (
                <div style={{ color:'var(--text-secondary)' }}>No linked order for this transaction.</div>
              ) : selectedOrder ? (
                <div>
                  <div style={{ fontWeight:600, marginBottom:8 }}>Order Items</div>
                  <div style={{ display:'grid', gap:8 }}>
                    {selectedOrder.items.map((it,i)=> (
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
                      <span className="tabular-nums">{fmt(selectedOrder.subtotal)}</span>
                    </div>
                    <div style={{ display:'flex', justifyContent:'space-between' }}>
                      <span>GST ({selectedOrder.gstPercent}%)</span>
                      <span className="tabular-nums">{fmt(selectedOrder.gstAmount)}</span>
                    </div>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:6 }}>
                      <span style={{ fontWeight:700 }}>Total</span>
                      <span className="tabular-nums" style={{ fontWeight:700 }}>{fmt(selectedOrder.total)}</span>
                    </div>
                    <div style={{ color:'var(--text-secondary)', fontSize:12 }}>Payment: {selectedOrder.provider==='wallet' ? 'Wallet' : 'Razorpay'}</div>
                  </div>
                </div>
              ) : (
                <div style={{ color:'var(--text-secondary)' }}>Loading order details…</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
