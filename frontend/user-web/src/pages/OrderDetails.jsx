import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../utils/api.js'
import { Box, Button, Card, CardContent, Chip, Divider, Grid, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Typography } from '@mui/material'

function StatusChip({ status }){
  const color = status==='delivered' ? 'success' : status==='paid' ? 'warning' : status==='refunded' ? 'error' : 'default'
  return <Chip size='small' label={status.toUpperCase()} color={color} />
}

export default function OrderDetails(){
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{ (async()=>{
    try { const o = await api.get(`/api/orders/${id}`); setOrder(o.data) }
    finally { setLoading(false) }
  })() },[id])

  if (loading) return (
    <Box>
      <Typography variant='h5' sx={{ fontWeight:700, mb:2 }}>Order Details</Typography>
      <Skeleton variant='rectangular' height={140} sx={{ mb:2 }} />
      <Skeleton variant='rectangular' height={260} />
    </Box>
  )
  if (!order) return null

  const pm = order.provider==='wallet' ? 'Wallet' : 'Razorpay'
  const fmt = (n) => `₹ ${Number(n ?? 0).toFixed(2)}`

  return (
    <Box>
      <Typography variant='h5' sx={{ fontWeight:700, mb:2 }}>Order Details</Typography>
      <Card sx={{ mb:2 }}>
        <CardContent>
          <Stack direction='row' spacing={1.5} alignItems='center' justifyContent='space-between'>
            <Stack direction='row' spacing={1.5} alignItems='center'>
              <StatusChip status={order.status} />
              <Typography variant='body2' color='text.secondary'>{new Date(order.createdAt).toLocaleString()}</Typography>
            </Stack>
            <Chip size='small' variant='outlined' label={pm.toUpperCase()} />
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant='subtitle1' sx={{ mb:1, fontWeight:600 }}>Receipt</Typography>
          <TableContainer>
            <Table size='small' sx={{
              borderCollapse:'separate',
              borderSpacing:0,
              '& thead th': { fontSize:12, color:'text.secondary', borderBottom:'1px solid', borderColor:'divider' },
              '& tbody td': { borderBottom:'1px dashed', borderColor:'divider' },
              '& tfoot td': { borderTop:'2px solid', borderColor:'divider' },
              '& td.MuiTableCell-alignRight, & th.MuiTableCell-alignRight': { fontVariantNumeric: 'tabular-nums' }
            }}>
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell align='right'>Qty</TableCell>
                  <TableCell align='right'>Price</TableCell>
                  <TableCell align='right'>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.items.map((it,i)=> (
                  <TableRow key={i}>
                    <TableCell>
                      <Stack direction='row' spacing={1} alignItems='center'>
                        {it.imageUrl ? (
                          <img src={it.imageUrl} alt='' style={{ width:28, height:28, objectFit:'cover', borderRadius:6 }} />
                        ) : (
                          <Box sx={{ width:28, height:28, borderRadius:1, bgcolor:'action.focus' }} />
                        )}
                        <Typography variant='body2'>{it.name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align='right'>{it.quantity}</TableCell>
                    <TableCell align='right'>{fmt(it.price)}</TableCell>
                    <TableCell align='right'>{fmt((it.price||0)*(it.quantity||0))}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3} align='right'><Typography color='text.secondary'>Subtotal</Typography></TableCell>
                  <TableCell align='right'>{fmt(order.subtotal)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} align='right'><Typography color='text.secondary'>GST ({order.gstPercent}%)</Typography></TableCell>
                  <TableCell align='right'>{fmt(order.gstAmount)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} align='right'><Typography variant='h6'>Total</Typography></TableCell>
                  <TableCell align='right'><Typography variant='h6'>{fmt(order.total)}</Typography></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>

          <Stack direction='row' spacing={1} sx={{ mt:2 }}>
            {(order.status==='paid' || order.status==='expired') && (
              <Button variant='contained' onClick={()=> navigate(`/orders/${order._id}/qr`)}>
                View QR / Refund
              </Button>
            )}
            {order.status==='delivered' && (
              <Button variant='outlined' onClick={()=> window.open(`/api/orders/${order._id}/invoice.pdf`, '_blank')}>Download Invoice</Button>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}
