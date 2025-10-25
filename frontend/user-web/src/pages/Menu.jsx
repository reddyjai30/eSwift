import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../utils/api.js'
import { Box, Button, Card, CardContent, Chip, Grid, IconButton, Skeleton, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, loadCart } from '../store/slices/cart.js'
import { useSnackbar } from 'notistack'

export default function Menu(){
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [qty, setQty] = useState({})
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const cart = useSelector(s=>s.cart.data)

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

  return (
    <Box>
      {!data ? (
        <>
          <Skeleton variant='text' width={220} />
          <Skeleton variant='rectangular' height={160} sx={{ mt:1 }} />
        </>
      ) : (
        <>
          {/* Banner with blurred logo background */}
          <Box sx={{ position:'relative', borderRadius:2, overflow:'hidden', mb:2 }}>
            <Box sx={{ position:'absolute', inset:0, backgroundImage:`url(${data.restaurant.logoUrl||''})`, backgroundSize:'cover', backgroundPosition:'center', filter:'blur(14px)', transform:'scale(1.1)', opacity:0.35 }} />
            <Box sx={{ position:'relative', p:2, display:'flex', alignItems:'center', gap:2, bgcolor:'rgba(0,0,0,0.18)' }}>
              {data.restaurant.logoUrl ? (<img src={data.restaurant.logoUrl} alt='' style={{ width:56, height:56, borderRadius:12, objectFit:'cover', background:'#fff' }} />) : (<Box sx={{ width:56, height:56, borderRadius:12, bgcolor:'action.focus' }} />)}
              <Box>
                <Typography variant='h6' sx={{ fontWeight:700, color:'#fff' }}>{data.restaurant.name}</Typography>
                <Typography variant='body2' sx={{ color:'#f1f1f1' }}>{data.restaurant.address}</Typography>
              </Box>
            </Box>
          </Box>

          {Object.keys(grouped).map(cat => (
            <Box key={cat} sx={{ mb:3 }}>
              <Typography variant='subtitle1' sx={{ fontWeight:600, mb:1 }}>{cat}</Typography>
              <Grid container spacing={1.5}>
                {grouped[cat].map(it => (
                  <Grid item xs={6} sm={4} md={3} key={it._id}>
                    <Card sx={{ opacity: it.canOrder ? 1 : 0.45 }}>
                      <Box sx={{ position:'relative' }}>
                        <Box sx={{ position:'relative', width:'100%', pt:'100%', overflow:'hidden' }}>
                          {it.imageUrl ? (
                            <img src={it.imageUrl} alt='' style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
                          ) : (
                            <Box sx={{ position:'absolute', inset:0, bgcolor:'action.focus' }} />
                          )}
                        </Box>
                        {it.stockMessage && (<Chip color='warning' size='small' label={it.stockMessage} sx={{ position:'absolute', top:6, left:6 }} />)}
                      </Box>
                      <CardContent sx={{ p:1.2 }}>
                        <Typography variant='subtitle2' noWrap sx={{ fontWeight:600 }}>{it.name}</Typography>
                        <Typography variant='caption' color='text.secondary'>₹ {it.price}</Typography>
                        <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', mt:1 }}>
                          <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
                            <IconButton className='pressable' size='small' onClick={()=>dec(it._id)} disabled={!it.canOrder && (qty[it._id]??0)===0}><RemoveIcon fontSize='small' /></IconButton>
                            <Typography sx={{ minWidth:18, textAlign:'center' }} variant='body2'>{qty[it._id] ?? 0}</Typography>
                            <IconButton className='pressable' size='small' onClick={()=>inc(it._id)} disabled={!it.canOrder}><AddIcon fontSize='small' /></IconButton>
                          </Box>
                          <Button size='small' variant='contained' disabled={!it.canOrder || (qty[it._id]??0)<=0} onClick={()=>add(it)}>Add</Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </>
      )}
    </Box>
  )
}
