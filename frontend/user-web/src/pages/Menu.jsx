import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../utils/api.js'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, loadCart } from '../store/slices/cart.js'
import { useSnackbar } from 'notistack'

export default function Menu(){
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [qty, setQty] = useState({})
  const [activeCat, setActiveCat] = useState('')
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const cart = useSelector(s=>s.cart.data)
  const catRefs = useRef({})

  useEffect(()=>{ (async()=>{ try{ const r = await api.get(`/api/restaurants/${id}/menu?includeUnavailable=1`); setData(r.data) } catch(e){ enqueueSnackbar(e.message,{variant:'error'}) } })() },[id])
  useEffect(()=>{ if (!cart) dispatch(loadCart()) },[cart, dispatch])
  // sync quantities from cart whenever cart or menu changes
  useEffect(()=>{
    if (!cart?.items) return
    const map = {}
    for (const it of cart.items){ map[it.itemId] = it.quantity }
    setQty(q => ({ ...map, ...q }))
  },[cart, data])

  function inc(itemId){ setQty(q => ({...q, [itemId]: Math.min(99, (q[itemId]??0)+1)})) }
  function dec(itemId){ setQty(q => ({...q, [itemId]: Math.max(0, (q[itemId]??0)-1)})) }

  async function add(item){
    const quantity = qty[item._id] ?? 0
    if (quantity <= 0) { enqueueSnackbar('Set quantity first', { variant:'warning' }); return }
    try {
      const res = await dispatch(addToCart({ restaurantId: id, items: [{ itemId: item._id, quantity }], replace: false })).unwrap()
      enqueueSnackbar('Added to cart', { variant:'success' })
    } catch(e){
      const details = e.details || e
      if (details && details.code === 'CART_RESTAURANT_MISMATCH'){
        if (confirm('Your cart has items from another restaurant. Clear and add new items?')){
          try { await dispatch(addToCart({ restaurantId: id, items: [{ itemId: item._id, quantity }], replace: true })).unwrap(); enqueueSnackbar('Cart replaced', { variant:'info' }) }
          catch(err){ enqueueSnackbar(err.message||'Failed', { variant:'error' }) }
        }
      } else {
        enqueueSnackbar(e.message || 'Failed to add', { variant:'error' })
      }
    }
  }

  const grouped = useMemo(()=>{
    if (!data?.items) return {}
    const g = {}
    for (const it of data.items){
      const c = it.category || 'Other'
      if (!g[c]) g[c] = []
      g[c].push(it)
    }
    return g
  },[data])

  const fmt = (n) => `₹ ${Number(n||0).toFixed(2)}`

  return (
    <div>
      {!data ? (
        <>
          <div style={{ width:220, height:24, background:'var(--bg-paper)', border:'1px solid var(--divider)', borderRadius:8 }} />
          <div style={{ height:160, background:'var(--bg-paper)', border:'1px solid var(--divider)', borderRadius:12, marginTop:8 }} />
        </>
      ) : (
        <>
          {/* Restaurant Banner */}
          <div style={{ position:'relative', borderRadius:12, overflow:'hidden', marginBottom:12 }}>
            <div style={{ position:'absolute', inset:0, backgroundImage:`url(${data.restaurant.logoUrl||''})`, backgroundSize:'cover', backgroundPosition:'center', filter:'blur(14px)', transform:'scale(1.1)', opacity:0.35 }} />
            <div style={{ position:'relative', padding:16, display:'flex', alignItems:'center', gap:12, background:'rgba(0,0,0,0.18)' }}>
              {data.restaurant.logoUrl ? (<img src={data.restaurant.logoUrl} alt='' style={{ width:56, height:56, borderRadius:12, objectFit:'cover', background:'#fff' }} />) : (<div style={{ width:56, height:56, borderRadius:12, background:'var(--surface)' }} />)}
              <div>
                <div style={{ fontWeight:700, color:'#fff' }}>{data.restaurant.name}</div>
                <div style={{ color:'#f1f1f1', fontSize:13 }}>{data.restaurant.address}</div>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div style={{ position:'sticky', top:0, zIndex:30, background:'var(--bg-default)', paddingBottom:8, marginBottom:8, borderBottom:'1px solid var(--divider)' }}>
            <div style={{ display:'flex', gap:8, overflowX:'auto', paddingBottom:4 }}>
              {Object.keys(grouped).map(cat => (
                <button key={cat} onClick={()=>{ const el = catRefs.current[cat]; if (el) el.scrollIntoView({ behavior:'smooth', block:'start' }); setActiveCat(cat) }}
                  style={{ padding:'8px 12px', borderRadius:999, border:'1px solid var(--divider)', background: activeCat===cat ? 'var(--primary)' : 'transparent', color: activeCat===cat ? '#fff' : 'var(--text-secondary)', whiteSpace:'nowrap' }}>{cat}</button>
              ))}
            </div>
          </div>

          {Object.keys(grouped).map(cat => (
            <div key={cat} ref={el => (catRefs.current[cat] = el)} style={{ marginBottom:16 }}>
              <div style={{ fontWeight:700, margin:'8px 0' }}>{cat}</div>
              <div style={{ display:'grid', gap:10 }}>
                {grouped[cat].map(it => (
                  <div key={it._id} style={{ opacity: it.canOrder ? 1 : 0.5, background:'var(--bg-paper)', border:'1px solid var(--divider)', borderRadius:12, padding:12, display:'flex', gap:12, alignItems:'center', boxShadow:'var(--e-1)' }}>
                    {it.imageUrl ? (
                      <img src={it.imageUrl} alt='' style={{ width:72, height:72, objectFit:'cover', borderRadius:12 }} />
                    ) : (
                      <div style={{ width:72, height:72, borderRadius:12, background:'var(--surface)' }} />
                    )}
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:600 }}>{it.name}</div>
                      {/* Stock badge */}
                      {it.stockMessage && (
                        <div style={{ marginTop:4, display:'inline-block', fontSize:12, padding:'2px 8px', borderRadius:999, color:'#F59E0B', border:'1px solid rgba(245,158,11,.3)', background:'rgba(245,158,11,.12)' }}>{it.stockMessage}</div>
                      )}
                      <div style={{ color:'var(--text-secondary)', fontSize:13, marginTop:6 }}>{fmt(it.price)}</div>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <button onClick={()=>dec(it._id)} disabled={!it.canOrder && (qty[it._id]??0)===0} style={{ width:28, height:28, borderRadius:8, border:'1px solid var(--divider)', background:'transparent', opacity: (!it.canOrder && (qty[it._id]??0)===0) ? 0.5 : 1 }}>–</button>
                      <div style={{ minWidth:24, textAlign:'center' }}>{qty[it._id] ?? 0}</div>
                      <button onClick={()=>inc(it._id)} disabled={!it.canOrder} style={{ width:28, height:28, borderRadius:8, border:'1px solid var(--divider)', background:'transparent', opacity: !it.canOrder ? 0.5 : 1 }}>+</button>
                    </div>
                    <button onClick={()=>add(it)} disabled={!it.canOrder || (qty[it._id]??0)<=0}
                      style={{ padding:'10px 12px', borderRadius:10, border:'none', background:'var(--gradient-primary)', color:'#fff', fontWeight:700, boxShadow:'var(--e-2)', opacity: (!it.canOrder || (qty[it._id]??0)<=0) ? 0.6 : 1 }}>
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
