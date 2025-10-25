import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loadCart, patchCartItems, removeCartItem } from '../store/slices/cart.js'
import { Box, Button, Card, CardContent, Checkbox, Divider, FormControlLabel, IconButton, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import DeleteIcon from '@mui/icons-material/Delete'
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
  return (
    <Box>
      <Typography variant='h5' sx={{ fontWeight:700, mb:2 }}>Your Cart</Typography>
      {items.length===0 && <Typography color='text.secondary'>Your cart is empty</Typography>}
      {items.map(it => (
        <Card key={it.itemId} sx={{ mb:1 }}>
          <CardContent sx={{ display:'flex', alignItems:'center', gap:2 }}>
            {it.imageUrl ? (<img src={it.imageUrl} alt='' style={{ width:56, height:56, objectFit:'cover', borderRadius:12 }} />) : (<Box sx={{ width:56, height:56, borderRadius:12, bgcolor:'action.focus' }} />)}
            <Box sx={{ flex:1 }}>
              <Typography variant='subtitle1'>{it.name}</Typography>
              <Typography color='text.secondary'>₹ {it.price}</Typography>
            </Box>
            <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
              <IconButton size='small' onClick={()=>dec(it)}><RemoveIcon/></IconButton>
              <Typography sx={{ minWidth:20, textAlign:'center' }}>{it.quantity}</Typography>
              <IconButton size='small' onClick={()=>inc(it)}><AddIcon/></IconButton>
              <IconButton size='small' color='error' onClick={()=>remove(it)}><DeleteIcon/></IconButton>
            </Box>
          </CardContent>
        </Card>
      ))}
      {items.length>0 && (
        <Card sx={{ mt:2 }}>
          <CardContent>
            <Typography>Subtotal: ₹ {cart.subtotal?.toFixed?.(2) ?? cart.subtotal}</Typography>
            <Typography>GST ({cart.gstPercent}%): ₹ {cart.gstAmount?.toFixed?.(2) ?? cart.gstAmount}</Typography>
            <Divider sx={{ my:1 }} />
            <Typography variant='h6'>Total: ₹ {cart.total?.toFixed?.(2) ?? cart.total}</Typography>
            <Box sx={{ mt:1 }}>
              <FormControlLabel control={<Checkbox checked={useWallet} onChange={(e)=>setUseWallet(e.target.checked)} />} label={`Pay via Wallet (₹ ${walletBalance.toFixed(2)})`} />
              {useWallet && (walletBalance < (cart.total || 0)) && (
                <Typography variant='caption' sx={{ color:'error.main', display:'block', mt:-1 }}>
                  Insufficient wallet balance — short by ₹ {(Math.max(0, (cart.total||0)-walletBalance)).toFixed(2)}
                </Typography>
              )}
            </Box>
            <Button fullWidth variant='contained' sx={{ mt:2 }} onClick={pay} disabled={!items.length || (useWallet && walletBalance < (cart.total || 0))}>
              {useWallet ? 'Pay from Wallet' : 'Proceed to Pay'}
            </Button>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}
