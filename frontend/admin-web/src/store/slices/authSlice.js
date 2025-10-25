import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../utils/api.js'

const tokenKey = 'eswift_admin_token'

export const login = createAsyncThunk('auth/login', async ({ username, password }) => {
  const res = await api.post('/api/admin/auth/login', { username, password })
  return res.data
})

const slice = createSlice({
  name: 'auth',
  initialState: { token: localStorage.getItem(tokenKey) || null, profile: null, status: 'idle', error: null },
  reducers: {
    logout(state) {
      state.token = null; state.profile = null; localStorage.removeItem(tokenKey)
    },
    setToken(state, action) { state.token = action.payload; localStorage.setItem(tokenKey, action.payload) }
  },
  extraReducers: (b) => {
    b.addCase(login.pending, (s) => { s.status = 'loading'; s.error = null })
     .addCase(login.fulfilled, (s, a) => {
       s.status = 'succeeded'; s.token = a.payload.token; s.profile = a.payload.admin; localStorage.setItem(tokenKey, a.payload.token)
     })
     .addCase(login.rejected, (s, a) => { s.status = 'failed'; s.error = a.error.message })
  }
})

export const { logout, setToken } = slice.actions
export default slice.reducer

