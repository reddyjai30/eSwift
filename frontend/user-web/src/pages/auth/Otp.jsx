import { useEffect, useState } from 'react'
import { Box, Button, Card, CardContent, TextField, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { loginStart, signupStart, verifyLogin, verifySignup } from '../../store/slices/auth.js'
import { useSnackbar } from 'notistack'
import { useNavigate } from 'react-router-dom'

export default function Otp(){
  const [code, setCode] = useState('')
  const phone = useSelector(s=>s.auth.phoneDraft)
  const flow = useSelector(s=>s.auth.flow)
  const signupDraft = useSelector(s=>s.auth.signupDraft)
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const [shake, setShake] = useState(false)

  useEffect(()=>{ if (!phone) navigate('/login') },[phone])

  async function onResend(){
    try {
      if (flow==='login') await dispatch(loginStart(phone)).unwrap()
      else await dispatch(signupStart({ name: signupDraft.name, phone, email: signupDraft.email })).unwrap()
      enqueueSnackbar('OTP resent', { variant:'info' })
    } catch(e){ enqueueSnackbar(e.message || 'Resend failed', { variant:'error' }) }
  }

  async function onVerify(e){
    e.preventDefault()
    try {
      if (flow==='login') await dispatch(verifyLogin({ phone, code })).unwrap()
      else await dispatch(verifySignup({ phone, code })).unwrap()
      enqueueSnackbar(flow==='login' ? 'Login successful' : 'Signed up successfully', { variant:'success' })
      navigate('/restaurants', { replace:true })
    } catch(e){ enqueueSnackbar(e.message || 'Invalid code', { variant:'error' }); setShake(true); setTimeout(()=>setShake(false), 500) }
  }

  return (
    <Box sx={{ position:'relative', minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', px:2 }}>
      <div className='backdrop-blobs'>
        <div className='blob primary' />
        <div className='blob accent' />
      </div>
      <Card sx={{ width:'100%', maxWidth: 520, overflow:'hidden', position:'relative', zIndex:1 }} className={shake ? 'shake' : ''}>
        <Box className='animated-gradient-bar' />
        <CardContent>
          <Typography variant='h6' sx={{ mb:1 }}>Verify OTP</Typography>
          <Typography color='text.secondary' sx={{ mb:2 }}>Sent to {phone}</Typography>
          {flow==='signup' && (
            <Typography variant='body2' color='text.secondary' sx={{ mb:2 }}>Signing up for {signupDraft.name || 'New User'} {signupDraft.email ? `(${signupDraft.email})` : ''}</Typography>
          )}
          <form onSubmit={onVerify}>
            <TextField fullWidth label='Enter 6-digit code' value={code} onChange={e=>setCode(e.target.value)} />
            <Button type='submit' fullWidth variant='contained' sx={{ mt:2, background: 'linear-gradient(135deg,#6C5CE7 0%, #00E5FF 100%)', boxShadow: 2 }}>Verify & Login</Button>
          </form>
          <Button onClick={onResend} sx={{ mt:1 }}>Resend OTP</Button>
        </CardContent>
      </Card>
    </Box>
  )
}
