import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../../utils/api.js'

const tokenKey = 'eswift_user_token'

export const loginStart = createAsyncThunk('auth/loginStart', async (phone) => {
  const res = await api.post('/api/auth/login/start', { phone })
  return res.data
})

export const signupStart = createAsyncThunk('auth/signupStart', async ({ name, phone, email }) => {
  const res = await api.post('/api/auth/signup/start', { name, phone, email })
  return res.data
})

export const verifyLogin = createAsyncThunk('auth/verifyLogin', async ({ phone, code }) => {
  const res = await api.post('/api/auth/login/verify', { phone, code })
  return res.data
})

export const verifySignup = createAsyncThunk('auth/verifySignup', async ({ phone, code }) => {
  const res = await api.post('/api/auth/signup/verify', { phone, code })
  return res.data
})

const slice = createSlice({
  name: 'auth',
  initialState: { token: localStorage.getItem(tokenKey) || null, user: null, phoneDraft: '', signupDraft: { name:'', email:'' }, status: 'idle', error: null, flow: 'login' },
  reducers: {
    logout(state){ state.token=null; state.user=null; localStorage.removeItem(tokenKey) },
    setPhoneDraft(state, action){ state.phoneDraft = action.payload },
    setFlow(state, action){ state.flow = action.payload },
    setSignupDraft(state, action){ state.signupDraft = { ...state.signupDraft, ...action.payload } }
  },
  extraReducers: (b) => {
    b
      .addCase(verifyLogin.fulfilled, (s,a)=>{ s.token=a.payload.token; s.user=a.payload.user; localStorage.setItem(tokenKey, a.payload.token) })
      .addCase(verifySignup.fulfilled, (s,a)=>{ s.token=a.payload.token; s.user=a.payload.user; localStorage.setItem(tokenKey, a.payload.token) })
  }
})

export const { logout, setPhoneDraft, setFlow, setSignupDraft } = slice.actions
export default slice.reducer
