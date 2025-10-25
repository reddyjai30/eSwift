import { useEffect, useState } from 'react'
import { Box, Button, Card, CardContent, TextField, Typography, InputAdornment } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { loginStart, setPhoneDraft, setFlow } from '../../store/slices/auth.js'
import { useSnackbar } from 'notistack'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [phone, setPhone] = useState('')
  const [code] = useState('+91')
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const phoneDraft = useSelector(s=>s.auth.phoneDraft)

  useEffect(()=>{
    if (phoneDraft?.startsWith(code)){
      const digits = phoneDraft.replace(code, '').replace(/\D/g,'')
      if (digits) setPhone(digits)
    }
  },[phoneDraft, code])

  async function onSubmit(e){
    e.preventDefault()
    try {
      const normalized = `${code}${phone.replace(/\D/g,'')}`
      await dispatch(loginStart(normalized)).unwrap()
      dispatch(setPhoneDraft(normalized))
      dispatch(setFlow('login'))
      enqueueSnackbar('OTP sent', { variant:'success' })
      navigate('/otp')
    } catch (e){
      // if not found, redirect to signup with number prefilled
      const msg = e.message || 'Account not found. Please sign up'
      enqueueSnackbar(msg, { variant:'warning' })
      const normalized = `${code}${phone.replace(/\D/g,'')}`
      dispatch(setPhoneDraft(normalized))
      dispatch(setFlow('signup'))
      navigate('/signup')
    }
  }

  return (
    <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:'70vh', px:2 }}>
      <Card sx={{ width:'100%', maxWidth: 420 }}>
        <CardContent>
          <Typography variant='h5' sx={{ mb:1, fontWeight:700 }}>Welcome to eSwift</Typography>
          <Typography color='text.secondary' sx={{ mb:2 }}>Enter your mobile number to continue</Typography>
          <form onSubmit={onSubmit}>
            <TextField fullWidth label='Mobile Number' placeholder='9876543210' value={phone} onChange={e=>setPhone(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position='start'>{code}</InputAdornment> }} />
            <Button type='submit' fullWidth variant='contained' sx={{ mt:2 }}>Send OTP</Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}
