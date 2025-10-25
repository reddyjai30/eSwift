import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadCart, patchCartItems, removeCartItem } from '../store/slices/cart.js'
import { useSnackbar } from 'notistack'
import { api } from '../utils/api.js'

export default function Cart(){
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const cart = useSelector(s=>s.cart.data)
  const [useWallet, setUseWallet] = useState(false)
  const [walletBalance, setWalletBalance] = useState(0)

  useEffect(()=>{ dispatch(loadCart()) },[])
  useEffect(()=>{ (async()=>{ try { const w = await api.get('/api/wallet'); setWalletBalance(w.data.balance||0) } catch{} })() },[])

  async function inc(item){ await dispatch(patchCartItems({ items:[{ itemId:item.itemId, quantity: item.quantity+1 }] })) }
  async function dec(item){ await dispatch(patchCartItems({ items:[{ itemId:item.itemId, quantity: Math.max(0, item.quantity-1) }] })) }
  async function remove(item){ await dispatch(removeCartItem(item.itemId)); enqueueSnackbar('Removed', { variant:'info' }) }

  async function pay(){
    try {
      if (useWallet){
        const total = cart?.total || 0
        if (walletBalance < total){
          const shortage = Math.max(0, total - walletBalance)
          enqueueSnackbar(`Insufficient wallet: short by ₹ ${shortage.toFixed(2)}`, { variant:'warning' })
          return
        }
        const r = await api.post('/api/payments/wallet', {})
        const { orderId } = r.data
        enqueueSnackbar('Paid via wallet', { variant:'success' })
        await dispatch(loadCart())
        window.location.href = `/orders/${orderId}/qr`
        return
      }
      const r = await api.post('/api/payments/create-order', {})
      const { orderId, razorpayOrderId, amount, currency, keyId } = r.data
      const options = {
        key: keyId,
        amount,
        currency,
        name: 'eSwift',
        description: 'Order Payment',
        order_id: razorpayOrderId,
        handler: async function (resp){
          try {
            await api.post('/api/payments/verify', {
              orderId,
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_signature: resp.razorpay_signature
            })
            enqueueSnackbar('Payment successful', { variant:'success' })
            await dispatch(loadCart())
            window.location.href = `/orders/${orderId}/qr`
          } catch(e){ enqueueSnackbar(e.message || 'Verification failed', { variant:'error' }) }
        },
        modal: {
          ondismiss: async () => {
            try { await api.post('/api/payments/cancel', { orderId }) } catch{}
            enqueueSnackbar('Payment cancelled', { variant:'warning' })
          }
        },
        theme: { color: '#6C5CE7' }
      }
      const rz = new window.Razorpay(options)
      rz.open()
    } catch(e){
      if (e.responseJson?.details?.code === 'STOCK_CONFLICT'){
        const items = e.responseJson.details.items || []
        const msg = items.map(i => {
          if (i.reason==='insufficient') return `Only ${i.available} left`
          if (i.reason==='out_of_stock') return 'Out of stock'
          if (i.reason==='unavailable') return 'Unavailable'
          return 'Issue'
        }).join(', ')
        enqueueSnackbar(`Update your cart: ${msg}`, { variant:'warning' })
        await dispatch(loadCart())
      } else if (e.responseJson?.details?.code === 'WALLET_INSUFFICIENT'){
        const shortage = e.responseJson?.details?.shortage || 0
        enqueueSnackbar(`Insufficient wallet: short by ₹ ${Number(shortage).toFixed(2)}` , { variant:'warning' })
      } else {
        enqueueSnackbar(e.message || 'Unable to start payment', { variant:'error' })
      }
    }
  }

  if (!cart) return null
  const items = cart.items || []
  const fmt = (n) => `₹ ${(Number(n||0)).toFixed(2)}`
  return (
    <div>
      <h2 style={{ fontWeight:700, fontSize:20, marginBottom:12 }}>Your Cart</h2>
      {items.length===0 && <div style={{ color:'var(--text-secondary)' }}>Your cart is empty</div>}
      {items.map(it => (
        <div key={it.itemId} style={{ background:'var(--bg-paper)', border:'1px solid var(--divider)', borderRadius:12, padding:12, display:'flex', alignItems:'center', gap:12, marginBottom:10, boxShadow:'var(--e-1)' }}>
          {it.imageUrl ? (
            <img src={it.imageUrl} alt='' style={{ width:56, height:56, objectFit:'cover', borderRadius:12 }} />
          ) : (
            <div style={{ width:56, height:56, borderRadius:12, background:'var(--surface)' }} />
          )}
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:600 }}>{it.name}</div>
            <div style={{ color:'var(--text-secondary)', fontSize:14 }}>{fmt(it.price)}</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <button onClick={()=>dec(it)} style={{ width:28, height:28, borderRadius:8, border:'1px solid var(--divider)', background:'transparent' }}>–</button>
            <div style={{ minWidth:24, textAlign:'center' }}>{it.quantity}</div>
            <button onClick={()=>inc(it)} style={{ width:28, height:28, borderRadius:8, border:'1px solid var(--divider)', background:'transparent' }}>+</button>
            <button onClick={()=>remove(it)} style={{ width:28, height:28, borderRadius:8, border:'1px solid var(--divider)', background:'transparent', color:'var(--error)' }}>×</button>
          </div>
        </div>
      ))}
      {items.length>0 && (
        <div style={{ background:'var(--bg-paper)', border:'1px solid var(--divider)', borderRadius:12, padding:16, marginTop:12, boxShadow:'var(--e-1)' }}>
          <div style={{ display:'grid', gap:6 }}>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <span>Subtotal</span>
              <span className="tabular-nums">{fmt(cart.subtotal)}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <span>GST ({cart.gstPercent}%)</span>
              <span className="tabular-nums">{fmt(cart.gstAmount)}</span>
            </div>
            <div style={{ borderTop:'1px solid var(--divider)', margin:'8px 0' }} />
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontWeight:700 }}>Total</span>
              <span className="tabular-nums" style={{ fontWeight:700 }}>{fmt(cart.total)}</span>
            </div>
          </div>
          <div style={{ marginTop:10 }}>
            <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
              <input type='checkbox' checked={useWallet} onChange={(e)=>setUseWallet(e.target.checked)} />
              <span>Pay via Wallet ({fmt(walletBalance)})</span>
            </label>
            {useWallet && (walletBalance < (cart.total || 0)) && (
              <div style={{ color:'var(--error)', fontSize:12, marginTop:4 }}>
                Insufficient wallet balance — short by {fmt(Math.max(0, (cart.total||0)-walletBalance))}
              </div>
            )}
          </div>
          <button onClick={pay} disabled={!items.length || (useWallet && walletBalance < (cart.total || 0))}
            style={{ width:'100%', marginTop:12, padding:'12px 14px', borderRadius:12, border:'none', color:'#fff', fontWeight:700, background: 'var(--gradient-primary)', opacity: (!items.length || (useWallet && walletBalance < (cart.total || 0))) ? 0.6 : 1, boxShadow:'var(--e-2)', cursor: (!items.length || (useWallet && walletBalance < (cart.total || 0))) ? 'not-allowed' : 'pointer' }}>
            {useWallet ? 'Pay from Wallet' : 'Proceed to Pay'}
          </button>
        </div>
      )}
    </div>
  )
}
