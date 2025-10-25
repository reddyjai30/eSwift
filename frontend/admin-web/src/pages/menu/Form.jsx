import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api, uploadMultipart, patchMultipart } from '../../utils/api.js'
import { Box, Button, Card, CardContent, Grid, TextField, Typography, Skeleton } from '@mui/material'
import { useSnackbar } from 'notistack'

export default function MenuForm() {
  const { id, itemId } = useParams()
  const navigate = useNavigate()
  const editing = !!itemId
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [quantity, setQuantity] = useState('0')
  const [file, setFile] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(editing)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => { (async () => {
    if (editing) {
      setLoading(true)
      try {
        const res = await api.get(`/api/admin/menu/${id}`)
        const item = res.data.find(x => x._id === itemId)
        if (item) {
          setName(item.name)
          setPrice(String(item.price))
          setCategory(item.category||'')
          setQuantity(String(item.quantity||0))
          setImageUrl(item.imageUrl || '')
        }
      } catch (e) { enqueueSnackbar(e.message, { variant: 'error' }) }
      finally { setLoading(false) }
    }
  })() }, [id, itemId, editing])

  async function save() {
    try {
      if (editing) {
        await api.patch(`/api/admin/menu/item/${itemId}`, { name, price: Number(price), category, quantity: Number(quantity) })
        if (file) await patchMultipart(`/api/admin/menu/${id}/item/${itemId}/image`, file, '?deleteOld=true')
        enqueueSnackbar('Item updated', { variant: 'success' })
      } else {
        const res = await api.post(`/api/admin/menu/${id}`, { name, price: Number(price), category, isAvailable: true, quantity: Number(quantity) })
        if (file) await uploadMultipart(`/api/admin/menu/${id}/item/${res.data._id}/image`, file)
        enqueueSnackbar('Item created', { variant: 'success' })
      }
    } catch (e) { enqueueSnackbar(e.message, { variant: 'error' }); return }
    navigate(`/restaurants/${id}/menu`)
  }

  return (
    <Box>
      <Typography variant='h5' sx={{ mb:2 }}>{editing ? 'Edit' : 'New'} Menu Item</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              {loading ? (
                <>
                  <Skeleton variant='text' width={220} height={48} />
                  <Skeleton variant='text' width={220} height={48} />
                  <Skeleton variant='text' width={220} height={48} />
                  <Skeleton variant='text' width={220} height={48} />
                </>
              ) : (
                <>
                  <TextField fullWidth label='Name' sx={{ mt:1 }} value={name} onChange={e=>setName(e.target.value)} />
                  <TextField fullWidth label='Price' type='number' sx={{ mt:2 }} value={price} onChange={e=>setPrice(e.target.value)} />
                  <TextField fullWidth label='Category' sx={{ mt:2 }} value={category} onChange={e=>setCategory(e.target.value)} />
                  <TextField fullWidth label='Quantity' type='number' sx={{ mt:2 }} value={quantity} onChange={e=>setQuantity(e.target.value)} />
                </>
              )}
              <Box sx={{ display:'flex', gap:2, mt:3 }}>
                <Button variant='contained' onClick={save} disabled={!name || !price}>{editing ? 'Save' : 'Create'}</Button>
                <Button onClick={()=>navigate(-1)}>Cancel</Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='subtitle1'>Image (optional)</Typography>
              { loading ? (
                <Skeleton variant='rectangular' height={180} sx={{ mt: 2 }} />
              ) : ( (file ? URL.createObjectURL(file) : imageUrl) && (
                <Box sx={{ mt:2 }}>
                  <img src={file ? URL.createObjectURL(file) : imageUrl} alt='item' style={{ maxWidth:'100%', borderRadius:8 }} />
                </Box>
              ))}
              <Button variant='outlined' component='label' sx={{ mt:1 }}>
                Choose File
                <input hidden type='file' onChange={e=>{ const f=e.target.files?.[0]||null; setFile(f) }} />
              </Button>
              <Typography variant='body2' color='text.secondary' sx={{ mt:1 }}>
                Add now or later; updates replace previous image.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
