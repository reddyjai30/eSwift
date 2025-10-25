import { useEffect, useState } from 'react'
import { api } from '../../utils/api.js'
import { Box, Button, Card, CardActions, CardContent, CardActionArea, Grid, TextField, Typography, Avatar, Skeleton } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'

export default function RestaurantsList() {
  const theme = useTheme()
  const [list, setList] = useState([])
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try {
      const res = await api.get('/api/admin/restaurants')
      setList(res.data)
    } catch (e) {
      enqueueSnackbar(e.message, { variant: 'error' })
    } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  async function create() {
    try {
      const res = await api.post('/api/admin/restaurants', { name, address })
      setName(''); setAddress('');
      setList([res.data, ...list])
      enqueueSnackbar('Restaurant created', { variant: 'success' })
      navigate(`/restaurants/${res.data._id}`)
    } catch (e) { enqueueSnackbar(e.message, { variant: 'error' }) }
  }

  return (
    <Box>
      <Box sx={{
        background: theme.custom?.heroGradient,
        color:'#fff', borderRadius:2, p:3, mb:3
      }}>
        <Typography variant='h5'>Your Restaurants</Typography>
        <Typography variant='body1' sx={{ opacity:0.95 }}>Create and manage restaurants for your branches.</Typography>
      </Box>
      <Box sx={{ display:'flex', gap:2, mb:3, flexWrap:'wrap' }}>
        <TextField label='Name' value={name} onChange={e=>setName(e.target.value)} />
        <TextField label='Address' value={address} onChange={e=>setAddress(e.target.value)} />
        <Button variant='contained' onClick={create} disabled={!name}>Add</Button>
      </Box>
      <Grid container spacing={2}>
        {loading && Array.from({ length: 6 }).map((_,i)=> (
          <Grid item xs={12} md={6} lg={4} key={i}>
            <Card>
              <CardContent>
                <Box sx={{ display:'flex', alignItems:'center', gap:2 }}>
                  <Skeleton variant='circular' width={40} height={40} />
                  <Skeleton variant='text' width={160} />
                </Box>
                <Skeleton variant='text' width={220} />
              </CardContent>
            </Card>
          </Grid>
        ))}
        {list.map(r => (
          <Grid item xs={12} md={6} lg={4} key={r._id}>
            <Card>
              <CardActionArea onClick={() => navigate(`/restaurants/${r._id}`)}>
                <CardContent>
                  <Box sx={{ display:'flex', alignItems:'center', gap:2 }}>
                    <Avatar src={r.logoUrl || undefined}>{r.name?.[0] || 'R'}</Avatar>
                    <Typography variant='h6' noWrap>{r.name}</Typography>
                  </Box>
                  <Typography color='text.secondary'>{r.address}</Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button component={RouterLink} to={`/restaurants/${r._id}`} size='small'>Manage</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
