import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../utils/api.js'
import { Box, Button, Card, CardActions, CardActionArea, CardContent, Grid, TextField, Typography, Fab, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem as MuiMenuItem, Select, InputLabel, FormControl, FormControlLabel, Switch, Skeleton } from '@mui/material'
import { useSnackbar } from 'notistack'
import AddIcon from '@mui/icons-material/Add'

export default function MenuList() {
  const { id } = useParams() // restaurant id
  const [items, setItems] = useState([])
  // filter/sort state
  const [query, setQuery] = useState('')
  const [useRegex, setUseRegex] = useState(false)
  const [category, setCategory] = useState('All')
  const [sortByCategory, setSortByCategory] = useState(true)

  // add dialog state
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [quantity, setQuantity] = useState('0')
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try { const res = await api.get(`/api/admin/menu/${id}`); setItems(res.data) }
    catch (e) { enqueueSnackbar(e.message, { variant: 'error' }) }
    finally { setLoading(false) }
  }
  useEffect(()=>{ load() },[id])

  const categories = useMemo(() => {
    const set = new Set(items.map(i => i.category).filter(Boolean))
    return ['All', ...Array.from(set)]
  }, [items])

  const filtered = useMemo(() => {
    let out = items
    if (category !== 'All') out = out.filter(i => (i.category || '') === category)
    if (query.trim()) {
      if (useRegex) {
        try {
          const re = new RegExp(query, 'i')
          out = out.filter(i => re.test(i.name) || re.test(i.category || ''))
        } catch {
          out = out.filter(i => (i.name + ' ' + (i.category||'')).toLowerCase().includes(query.toLowerCase()))
        }
      } else {
        out = out.filter(i => (i.name + ' ' + (i.category||'')).toLowerCase().includes(query.toLowerCase()))
      }
    }
    if (sortByCategory) {
      out = [...out].sort((a,b)=> ((a.category||'').localeCompare(b.category||'')) || a.name.localeCompare(b.name))
    }
    return out
  }, [items, category, query, useRegex, sortByCategory])

  async function create() {
    const body = { name, price: Number(price), category: newCategory, isAvailable: true, quantity: Number(quantity) }
    try {
      const res = await api.post(`/api/admin/menu/${id}`, body)
      setItems([res.data, ...items])
      enqueueSnackbar('Menu item created', { variant: 'success' })
    } catch (e) { enqueueSnackbar(e.message, { variant: 'error' }) }
    setName(''); setPrice(''); setNewCategory(''); setQuantity('0'); setOpen(false)
  }

  return (
    <Box>
      <Box sx={{ display:'flex', gap:2, mb:2, flexWrap:'wrap', alignItems:'center' }}>
        <TextField label='Search (supports regex)' size='small' value={query} onChange={e=>setQuery(e.target.value)} />
        <FormControlLabel control={<Switch checked={useRegex} onChange={e=>setUseRegex(e.target.checked)} />} label='Regex' />
        <FormControl size='small'>
          <InputLabel>Category</InputLabel>
          <Select label='Category' value={category} onChange={e=>setCategory(e.target.value)} sx={{ minWidth: 160 }}>
            {categories.map(c => <MuiMenuItem key={c} value={c}>{c}</MuiMenuItem>)}
          </Select>
        </FormControl>
        <FormControlLabel control={<Switch checked={sortByCategory} onChange={e=>setSortByCategory(e.target.checked)} />} label='Sort by category' />
      </Box>
      <Grid container spacing={2}>
        {loading && Array.from({ length: 9 }).map((_,i)=> (
          <Grid item xs={12} md={6} lg={4} key={i}>
            <Card>
              <CardContent>
                <Skeleton variant='text' width={180} />
                <Skeleton variant='text' width={120} />
                <Skeleton variant='rectangular' height={120} sx={{ mt:1 }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
        {filtered.map(it => (
          <Grid item xs={12} md={6} lg={4} key={it._id}>
            <Card>
              <CardActionArea onClick={() => navigate(`/restaurants/${id}/menu/${it._id}/edit`)}>
                <CardContent>
                  <Typography variant='h6' noWrap>{it.name}</Typography>
                  <Typography color='text.secondary'>{it.category || 'Uncategorized'}</Typography>
                  <Typography sx={{ mt:1 }}>₹ {it.price}</Typography>
                  <Typography variant='body2' color='text.secondary'>Available: {it.quantity ?? 0}</Typography>
                  {it.imageUrl && (<Box sx={{ mt:1 }}><img src={it.imageUrl} alt='item' style={{ maxWidth:'100%', borderRadius:8 }} /></Box>)}
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button onClick={() => navigate(`/restaurants/${id}/menu/${it._id}/edit`)}>Edit</Button>
                <Button onClick={async () => { try { await api.del(`/api/admin/menu/item/${it._id}`); enqueueSnackbar('Deleted', { variant: 'success' }); await load() } catch (e) { enqueueSnackbar(e.message, { variant: 'error' }) } }} color='error'>Delete</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Fab color='primary' aria-label='add' sx={{ position:'fixed', bottom: 24, right: 24 }} onClick={()=>setOpen(true)}>
        <AddIcon />
      </Fab>

      <Dialog open={open} onClose={()=>setOpen(false)} fullWidth maxWidth='sm'>
        <DialogTitle>Add Menu Item</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField fullWidth label='Name' sx={{ mt:1 }} value={name} onChange={e=>setName(e.target.value)} />
          <TextField fullWidth label='Price' type='number' sx={{ mt:2 }} value={price} onChange={e=>setPrice(e.target.value)} />
          <TextField fullWidth label='Category' sx={{ mt:2 }} value={newCategory} onChange={e=>setNewCategory(e.target.value)} />
          <TextField fullWidth label='Quantity' type='number' sx={{ mt:2 }} value={quantity} onChange={e=>setQuantity(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpen(false)}>Cancel</Button>
          <Button variant='contained' onClick={create} disabled={!name || !price}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
