import { useEffect, useState, useMemo } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import { api, uploadMultipart } from '../../utils/api.js'
import { Box, Button, Card, CardContent, Grid, TextField, Typography, Skeleton } from '@mui/material'
import { useSnackbar } from 'notistack'

export default function RestaurantDetail() {
  const { id } = useParams()
  const [r, setR] = useState(null)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [file, setFile] = useState(null)
  const previewUrl = useMemo(() => file ? URL.createObjectURL(file) : '', [file])
  const [loading, setLoading] = useState(true)
  const { enqueueSnackbar } = useSnackbar()

  async function load() {
    setLoading(true)
    try {
      const res = await api.get(`/api/admin/restaurants/${id}`)
      setR(res.data); setName(res.data.name||''); setAddress(res.data.address||'')
    } catch (e) { enqueueSnackbar(e.message, { variant: 'error' }) }
    finally { setLoading(false) }
  }
  useEffect(()=>{ load() },[id])

  async function save() {
    try { await api.patch(`/api/admin/restaurants/${id}`, { name, address }); enqueueSnackbar('Saved', { variant: 'success' }) }
    catch (e) { enqueueSnackbar(e.message, { variant: 'error' }) }
    await load()
  }

  async function uploadLogo() {
    if (!file) return;
    try { await uploadMultipart(`/api/admin/restaurants/${id}/logo`, file, '?deleteOld=true'); enqueueSnackbar('Logo updated', { variant: 'success' }) }
    catch (e) { enqueueSnackbar(e.message, { variant: 'error' }) }
    setFile(null)
    await load()
  }

  if (!r && loading) {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}><Skeleton variant='rectangular' height={260} /></Grid>
        <Grid item xs={12} md={6}><Skeleton variant='rectangular' height={260} /></Grid>
      </Grid>
    )
  }
  if (!r) return null
  return (
    <Box>
      <Typography variant='h5' sx={{ mb:2 }}>{r.name}</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6'>Details</Typography>
              <TextField fullWidth label='Name' sx={{ mt:2 }} value={name} onChange={e=>setName(e.target.value)} />
              <TextField fullWidth label='Address' sx={{ mt:2 }} value={address} onChange={e=>setAddress(e.target.value)} />
              <Button variant='contained' sx={{ mt:2 }} onClick={save}>Save</Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6'>Logo</Typography>
              {(previewUrl || r.logoUrl) && (
                <Box sx={{ mt:2 }}>
                  <img src={previewUrl || r.logoUrl} alt='logo' style={{ maxWidth: '100%', borderRadius: 8 }} />
                </Box>
              )}
              <Box sx={{ display:'flex', gap:2, mt:2 }}>
                <Button variant='outlined' component='label'>
                  Choose File
                  <input hidden type='file' onChange={e=>setFile(e.target.files?.[0]||null)} />
                </Button>
                <Button variant='contained' disabled={!file} onClick={uploadLogo}>Upload</Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Box sx={{ mt:3 }}>
        <Button component={RouterLink} to={`/restaurants/${id}/menu`} variant='contained'>Manage Menu</Button>
      </Box>
    </Box>
  )
}
