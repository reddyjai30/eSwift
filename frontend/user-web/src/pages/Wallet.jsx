import { useEffect, useState } from 'react'
import { api } from '../utils/api.js'
import { Avatar, Box, Card, CardContent, Chip, Dialog, DialogContent, DialogTitle, Divider, Grid, IconButton, List, ListItemAvatar, ListItemButton, ListItemText, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

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

  return (
    <Box>
      <Typography variant='h5' sx={{ fontWeight:700, mb:2 }}>Wallet</Typography>
      <Card sx={{ mb:2 }}>
        <CardContent>
          <Typography color='text.secondary'>Balance</Typography>
          <Typography variant='h4'>₹ {balance.toFixed(2)}</Typography>
        </CardContent>
      </Card>
      <Typography variant='subtitle1' sx={{ mb:1 }}>Transactions</Typography>
      <Card>
        <List>
          {txns.map(tx => (
            <ListItemButton key={tx._id} onClick={()=>openTxn(tx)}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: tx.type==='credit' ? 'success.main' : 'error.main' }}>{tx.type==='credit' ? '+' : '-'}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <Typography sx={{ fontWeight:600, color: tx.type==='credit' ? 'success.main' : 'error.main' }}>{tx.type==='credit' ? '+ ' : '- '}₹ {tx.amount}</Typography>
                  <Chip size='small' label={(tx.method||'wallet').toUpperCase()} variant='outlined' />
                </Box>}
                secondary={<Typography variant='caption' color='text.secondary'>{new Date(tx.createdAt).toLocaleString()}</Typography>}
              />
            </ListItemButton>
          ))}
          {txns.length===0 && (
            <Box sx={{ p:2 }}><Typography color='text.secondary'>No transactions yet.</Typography></Box>
          )}
        </List>
      </Card>

      <Dialog open={open} onClose={()=>setOpen(false)} fullWidth maxWidth='sm'>
        <DialogTitle>
          Transaction Details
          <IconButton aria-label='close' onClick={()=>setOpen(false)} sx={{ position:'absolute', right:8, top:8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedTxn && (
            <Box sx={{ mb:2 }}>
              <Typography sx={{ fontWeight:700, fontSize:18 }}>{selectedTxn.type==='credit' ? 'Credit' : 'Debit'} • ₹ {selectedTxn.amount}</Typography>
              <Typography variant='caption' color='text.secondary'>{new Date(selectedTxn.createdAt).toLocaleString()} • {selectedTxn.method?.toUpperCase?.() || 'WALLET'}</Typography>
            </Box>
          )}
          {selectedTxn && !selectedTxn.orderId ? (
            <Typography color='text.secondary'>No linked order for this transaction.</Typography>
          ) : selectedOrder ? (
            <Box>
              <Typography variant='subtitle1' sx={{ mb:1 }}>Order Items</Typography>
              <Grid container spacing={1}>
                {selectedOrder.items.map((it,i)=> (
                  <Grid item xs={12} key={i}>
                    <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:1 }}>
                      {it.imageUrl ? (<img src={it.imageUrl} alt='' style={{ width:36, height:36, objectFit:'cover', borderRadius:8 }} />) : (<Box sx={{ width:36, height:36, borderRadius:8, bgcolor:'action.focus' }} />)}
                      <Box sx={{ flex:1, ml:1 }}>
                        <Typography>{it.name} x {it.quantity}</Typography>
                      </Box>
                      <Typography>₹ {it.price*it.quantity}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <Divider sx={{ my:1 }} />
              <Box sx={{ display:'grid', gap:0.5 }}>
                <Typography>Subtotal: ₹ {selectedOrder.subtotal}</Typography>
                <Typography>GST ({selectedOrder.gstPercent}%): ₹ {selectedOrder.gstAmount}</Typography>
                <Typography variant='h6'>Total: ₹ {selectedOrder.total}</Typography>
                <Typography color='text.secondary'>Payment: {selectedOrder.provider==='wallet' ? 'Wallet' : 'Razorpay'}</Typography>
              </Box>
            </Box>
          ) : (
            <Typography color='text.secondary'>Loading order details…</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  )
}
