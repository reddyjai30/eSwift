import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../utils/api.js'

export const loadCart = createAsyncThunk('cart/load', async () => {
  const res = await api.get('/api/cart')
  return res.data
})

export const addToCart = createAsyncThunk('cart/add', async ({ restaurantId, items, replace }, { rejectWithValue }) => {
  try { const res = await api.post('/api/cart/items', { restaurantId, items, replace }); return res.data }
  catch (e) { return rejectWithValue(e.responseJson || { message: e.message }) }
})

export const patchCartItems = createAsyncThunk('cart/patch', async ({ items }) => {
  const res = await api.patch('/api/cart/items', { items })
  return res.data
})

export const removeCartItem = createAsyncThunk('cart/removeItem', async (itemId) => {
  const res = await api.del(`/api/cart/items/${itemId}`)
  return res.data
})

const slice = createSlice({
  name: 'cart',
  initialState: { data: null, status: 'idle', error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(loadCart.fulfilled, (s,a)=>{ s.data=a.payload })
     .addCase(addToCart.fulfilled, (s,a)=>{ s.data=a.payload; s.error=null })
     .addCase(addToCart.rejected, (s,a)=>{ s.error=a.payload || { message:'Add failed' } })
     .addCase(patchCartItems.fulfilled, (s,a)=>{ s.data=a.payload })
     .addCase(removeCartItem.fulfilled, (s,a)=>{ s.data=a.payload })
  }
})

export default slice.reducer

