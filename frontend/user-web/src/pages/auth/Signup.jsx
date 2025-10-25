import { useEffect, useState } from 'react'
import { Box, Button, Card, CardContent, TextField, Typography, InputAdornment } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { signupStart, setPhoneDraft, setFlow, setSignupDraft } from '../../store/slices/auth.js'
import { useSnackbar } from 'notistack'
import { useNavigate } from 'react-router-dom'

export default function Signup(){
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [code] = useState('+91')
  const [email, setEmail] = useState('')
  const dispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const phoneDraft = useSelector(s=>s.auth.phoneDraft)

  useEffect(()=>{
    if (phoneDraft?.startsWith(code)){
      const digits = phoneDraft.replace(code,'').replace(/\D/g,'')
      if (digits) setPhone(digits)
    }
  },[phoneDraft, code])

  async function onSubmit(e){
    e.preventDefault()
    try {
      const normalized = `${code}${phone.replace(/\D/g,'')}`
      await dispatch(signupStart({ name, phone: normalized, email })).unwrap()
      dispatch(setPhoneDraft(normalized))
      dispatch(setSignupDraft({ name, email }))
      dispatch(setFlow('signup'))
      enqueueSnackbar('OTP sent for signup', { variant:'success' })
      navigate('/otp')
    } catch(e){
      const msg = e.message || 'Phone already registered'
      enqueueSnackbar(msg, { variant:'warning' })
      dispatch(setPhoneDraft(normalized))
      dispatch(setFlow('login'))
      navigate('/login')
    }
  }

  return (
    <Box sx={{ position:'relative', minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', px:2 }}>
      <div className='backdrop-blobs'>
        <div className='blob primary' />
        <div className='blob accent' />
      </div>
      <Card sx={{ width:'100%', maxWidth: 520, overflow:'hidden', position:'relative', zIndex:1 }}>
        <Box className='animated-gradient-bar' />
        <CardContent>
          <Typography variant='h5' sx={{ mb:1, fontWeight:700 }}>Create Account</Typography>
          <form onSubmit={onSubmit}>
            <TextField label='Name' fullWidth sx={{ mb:2 }} value={name} onChange={e=>setName(e.target.value)} />
            <TextField label='Mobile Number' placeholder='9876543210' fullWidth sx={{ mb:2 }} value={phone} onChange={e=>setPhone(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position='start'>{code}</InputAdornment> }} />
            <TextField label='Email (optional)' fullWidth sx={{ mb:2 }} value={email} onChange={e=>setEmail(e.target.value)} />
            <Button type='submit' fullWidth variant='contained' sx={{ background: 'linear-gradient(135deg,#6C5CE7 0%, #00E5FF 100%)', boxShadow: 2 }}>Send OTP</Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}
