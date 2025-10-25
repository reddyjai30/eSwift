import { useEffect, useState } from 'react'
import { Box, Button, Card, CardContent, TextField, Typography } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../store/slices/authSlice.js'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSnackbar } from 'notistack'

export default function Login() {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('Admin@123')
  const dispatch = useDispatch()
  const status = useSelector(s => s.auth.status)
  const error = useSelector(s => s.auth.error)
  const navigate = useNavigate()
  const loc = useLocation()
  const { enqueueSnackbar } = useSnackbar()
  const [shake, setShake] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    const res = await dispatch(login({ username, password }))
    if (res.meta.requestStatus === 'fulfilled') {
      enqueueSnackbar('Welcome back!', { variant: 'success' })
      navigate(loc.state?.from || '/dashboard', { replace: true })
    } else {
      setShake(true)
      enqueueSnackbar('Wrong username or password. Try again.', { variant: 'error' })
      setTimeout(()=>setShake(false), 500)
    }
  }

  return (
    <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', bgcolor:'#f5f7fb' }}>
      <Card sx={{ width:400 }} className={shake ? 'shake' : ''}>
        <CardContent>
          <Typography variant='h5' sx={{ mb:2 }}>eSwift Admin Login</Typography>
          <form onSubmit={onSubmit}>
            <TextField label='Username' fullWidth margin='normal' value={username} onChange={e=>setUsername(e.target.value)} />
            <TextField label='Password' type='password' fullWidth margin='normal' value={password} onChange={e=>setPassword(e.target.value)} />
            <Button type='submit' variant='contained' fullWidth disabled={status==='loading'} sx={{ mt:2 }}>
              {status==='loading' ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}
