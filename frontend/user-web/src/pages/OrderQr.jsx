import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../utils/api.js'
import { Box, Button, Card, CardContent, Chip, Grid, LinearProgress, Typography } from '@mui/material'
import QRCode from 'react-qr-code'
import dayjs from 'dayjs'

export default function OrderQr(){
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [qr, setQr] = useState(null)
  const [now, setNow] = useState(Date.now())
  const [autoExpired, setAutoExpired] = useState(false)
  const [refundStage, setRefundStage] = useState('idle') // idle|initiated|processing|success|error
  const [refundMethod, setRefundMethod] = useState(null)
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
  const statusColor = order?.status==='delivered' ? 'success' : order?.status==='paid' ? 'warning' : order?.status==='refunded' ? 'error' : order?.status==='expired' ? 'default' : 'default'

  const onExpire = async () => {
    try { await api.post(`/api/orders/${id}/expire`, {}); const o = await api.get(`/api/orders/${id}`); setOrder(o.data); setQr(null) } catch(e){}
  }
  // auto-expire when timer hits 0 — keep hook order stable
  useEffect(()=>{
    if (!order || order.status !== 'paid') return
    if (qr?.expiresAt && expiresIn === 0 && !autoExpired){ setAutoExpired(true); onExpire() }
  },[expiresIn, order, qr, autoExpired])
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

  return (
    <Box>
      <Typography variant='h5' sx={{ fontWeight:700, mb:1 }}>Order</Typography>
      <Chip color={statusColor} label={order.status.toUpperCase()} sx={{ mb:2 }} />
      <Card sx={{ mb:2 }}>
        <CardContent>
          <Typography variant='subtitle1'>Bill</Typography>
          <Grid container spacing={1} sx={{ mt:1 }}>
            {order.items.map((it,i)=> (
              <Grid item xs={12} key={i}>
                <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:1 }}>
                  {it.imageUrl ? (
                    <img src={it.imageUrl} alt='' style={{ width:36, height:36, objectFit:'cover', borderRadius:8 }} />
                  ) : (
                    <Box sx={{ width:36, height:36, borderRadius:8, bgcolor:'action.focus' }} />
                  )}
                  <Box sx={{ flex:1, ml:1 }}>
                    <Typography>{it.name} x {it.quantity}</Typography>
                  </Box>
                  <Typography>₹ {it.price*it.quantity}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt:1, display:'grid', gap:0.5 }}>
            <Typography>Subtotal: ₹ {order.subtotal}</Typography>
            <Typography>GST ({order.gstPercent}%): ₹ {order.gstAmount}</Typography>
            <Typography variant='h6'>Total: ₹ {order.total}</Typography>
            <Typography color='text.secondary'>Payment: {order.provider==='wallet' ? 'Wallet' : 'Razorpay'}</Typography>
          </Box>
        </CardContent>
      </Card>
      {order.status==='paid' && qr ? (
        <Card>
          <CardContent sx={{ textAlign:'center' }}>
            <Typography sx={{ mb:1 }}>Show this QR at the counter</Typography>
            <Box sx={{ display:'flex', justifyContent:'center' }}>
              <QRCode value={qr.token} size={200} />
            </Box>
            <Typography sx={{ mt:1 }}>
              Expires in {mm}:{ss}
            </Typography>
            <Button sx={{ mt:1 }} onClick={()=>{
              const link = document.createElement('a');
              link.href = `data:image/svg+xml,${encodeURIComponent(document.querySelector('svg')?.outerHTML || '')}`;
              link.download = `eswift-order-${id}.svg`; link.click()
            }}>Download QR</Button>
          </CardContent>
        </Card>
      ) : order.status==='delivered' ? (
        <Card>
          <CardContent sx={{ textAlign:'center' }}>
            <Typography variant='h6' sx={{ mb:1 }}>Thank you for reaching the restaurant!</Typography>
            <Typography color='text.secondary'>Please collect your bill at the counter.</Typography>
            <Button sx={{ mt:2 }} onClick={()=>window.open(`/api/orders/${id}/invoice.pdf`, '_blank')}>Download Invoice PDF</Button>
          </CardContent>
        </Card>
      ) : order.status==='expired' ? (
        <Card>
          <CardContent sx={{ textAlign:'center' }}>
            <Typography variant='h6' sx={{ mb:1 }}>Time’s up — QR expired</Typography>
            <Typography color='text.secondary'>Choose a refund option:</Typography>
            <Box sx={{ display:'flex', gap:1, justifyContent:'center', mt:2 }}>
              <Button variant='contained' disabled={refundStage==='processing'} onClick={()=>refund('wallet')}>Refund to Wallet</Button>
              <Button variant='outlined' disabled={refundStage==='processing'} onClick={()=>refund('original')}>Refund to Original</Button>
            </Box>
            {refundStage!=='idle' && (
              <Box sx={{ maxWidth:380, mx:'auto', mt:2, textAlign:'left' }}>
                <Typography variant='caption' color='text.secondary'>Refund {refundMethod==='wallet' ? 'to Wallet' : 'to Original'}:</Typography>
                <Box sx={{ display:'grid', gap:0.75, mt:0.5 }}>
                  <Typography sx={{ opacity: refundStage!=='idle' ? 1 : 0.4 }}>• Initiated</Typography>
                  <Box>
                    <Typography sx={{ mb:0.5, opacity: refundStage==='success' || refundStage==='processing' ? 1 : 0.4 }}>• In progress</Typography>
                    {refundStage==='processing' && <LinearProgress />}
                  </Box>
                  {refundStage==='success' && (
                    <Typography sx={{ color:'success.main', fontWeight:600 }}>✓ Successful</Typography>
                  )}
                  {refundStage==='error' && (
                    <Typography sx={{ color:'error.main', fontWeight:600 }}>× Failed — try again</Typography>
                  )}
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      ) : order.status==='refunded' ? (
        <Card>
          <CardContent sx={{ textAlign:'center' }}>
            <Typography variant='h6' sx={{ mb:1 }}>Refund Successful</Typography>
            <Typography color='text.secondary'>Amount has been {order.refundMethod==='wallet' ? 'credited to your wallet' : 'refunded to your original payment method'}.</Typography>
          </CardContent>
        </Card>
      ) : (
        <Typography color='text.secondary'>QR not available for this order.</Typography>
      )}
    </Box>
  )
}
