import { useEffect, useState } from 'react'
import { api } from '../utils/api.js'
import { Avatar, Box, Card, CardActionArea, CardContent, Chip, Grid, Skeleton, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'

function StatusDot({ status }){
  let color = '#9e9e9e'
  if (status==='paid') color = '#ffb300' // yellow
  if (status==='delivered') color = '#4caf50' // green
  if (status==='refunded' || status==='failed') color = '#f44336' // red
  if (status==='expired') color = '#9e9e9e' // grey
  return <Box sx={{ width:8, height:8, borderRadius:'50%', bgcolor: color }} />
}

function StatusChip({ status }){
  const color = status==='delivered' ? 'success' : status==='paid' ? 'warning' : status==='refunded' ? 'error' : 'default'
  return <Chip size='small' label={status.toUpperCase()} color={color} />
}

export default function Orders(){
  const [rows, setRows] = useState(null)
  const navigate = useNavigate()
  useEffect(()=>{ (async()=>{ const r = await api.get('/api/orders'); setRows(r.data) })() },[])
  return (
    <Box>
      <Typography variant='h5' sx={{ fontWeight:700, mb:2 }}>Your Orders</Typography>
      {!rows ? (
        Array.from({length:4}).map((_,i)=> (<Skeleton key={i} variant='rectangular' height={72} sx={{ mb:1 }} />))
      ) : rows.length===0 ? (
        <Typography color='text.secondary'>No orders yet.</Typography>
      ) : (
        <Grid container spacing={1.5}>
          {rows.map(o => (
            <Grid item xs={12} key={o._id}>
              <Card>
                <CardActionArea onClick={()=> navigate(`/orders/${o._id}`)}>
                  <CardContent sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', py:1.25, minHeight:80 }}>
                    <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
                      <StatusDot status={o.status} />
                      <Box>
                        <Typography variant='subtitle1' sx={{ fontWeight:600 }}>₹ {o.total}</Typography>
                        <Typography variant='caption' color='text.secondary'>{dayjs(o.createdAt).format('DD MMM, HH:mm')}</Typography>
                        <Stack direction='row' spacing={0.75} sx={{ mt:0.5 }}>
                          {(o.items||[]).slice(0,3).map((it,idx)=> (
                            <Avatar key={idx} src={it.imageUrl||''} variant='rounded' sx={{ width:24, height:24, borderRadius:1, border:'1px solid', borderColor:'divider' }}>{!it.imageUrl && it.name?.[0]}</Avatar>
                          ))}
                          {(o.items?.length||0) > 3 && (
                            <Typography variant='caption' color='text.secondary'>+{o.items.length-3}</Typography>
                          )}
                        </Stack>
                      </Box>
                    </Box>
                    <Box sx={{ ml:2 }}>
                      <StatusChip status={o.status} />
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}
