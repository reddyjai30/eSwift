import { useEffect, useState } from 'react'
import { api } from '../utils/api.js'
import { Box, Card, CardActionArea, CardContent, Grid, Skeleton, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'

export default function Restaurants(){
  const [rows, setRows] = useState(null)
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  useEffect(()=>{ (async()=>{ try{ const r = await api.get('/api/restaurants'); setRows(r.data) } catch(e){ enqueueSnackbar(e.message,{variant:'error'}) } })() },[])
  return (
    <Box>
      <Typography variant='h5' sx={{ fontWeight:700, mb:2 }}>Nearby Restaurants</Typography>
      <Grid container spacing={2}>
        {!rows && Array.from({length:6}).map((_,i)=> (
          <Grid item xs={12} key={i}><Skeleton variant='rectangular' height={86} /></Grid>
        ))}
        {rows && rows.map(r => (
          <Grid item xs={12} key={r._id}>
            <Card>
              <CardActionArea onClick={()=>navigate(`/restaurants/${r._id}/menu`)}>
                <CardContent sx={{ display:'flex', alignItems:'center', gap:2 }}>
                  {r.logoUrl ? (<img src={r.logoUrl} alt='' style={{ width:56, height:56, objectFit:'cover', borderRadius:12 }} />) : (
                    <Box sx={{ width:56, height:56, borderRadius:12, bgcolor:'action.focus' }} />)}
                  <Box>
                    <Typography variant='subtitle1' sx={{ fontWeight:600 }}>{r.name}</Typography>
                    <Typography variant='body2' color='text.secondary'>{r.address}</Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

