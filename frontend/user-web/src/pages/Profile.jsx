import { useEffect, useState } from 'react'
import { Box, Button, Card, CardContent, TextField, Typography } from '@mui/material'
import { api } from '../utils/api.js'
import { useSnackbar } from 'notistack'
import { useDispatch } from 'react-redux'
import { logout } from '../store/slices/auth.js'
import { useNavigate } from 'react-router-dom'

export default function Profile(){
  const [profile, setProfile] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const { enqueueSnackbar } = useSnackbar()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(()=>{ (async()=>{ try{ const r = await api.get('/api/user/profile'); setProfile(r.data); setName(r.data.name||''); setEmail(r.data.email||'') } catch(e){ enqueueSnackbar(e.message,{variant:'error'}) } })() },[])

  async function save(){ try{ await api.patch('/api/user/profile',{ name, email }); enqueueSnackbar('Profile updated',{variant:'success'}) } catch(e){ enqueueSnackbar(e.message,{variant:'error'}) } }
  function onLogout(){ dispatch(logout()); enqueueSnackbar('Logged out',{variant:'info'}); navigate('/welcome',{replace:true}) }

  if (!profile) return null
  return (
    <Box>
      <Typography variant='h5' sx={{ fontWeight:700, mb:2 }}>Your Profile</Typography>
      <Card>
        <CardContent>
          <TextField fullWidth label='Name' sx={{ mb:2 }} value={name} onChange={e=>setName(e.target.value)} />
          <TextField fullWidth label='Mobile Number' value={profile.phone} InputProps={{ readOnly:true }} sx={{ mb:2 }} />
          <TextField fullWidth label='Email (optional)' value={email} onChange={e=>setEmail(e.target.value)} sx={{ mb:2 }} />
          <Button variant='contained' onClick={save}>Save</Button>
          <Button color='error' sx={{ ml:1 }} onClick={onLogout}>Logout</Button>
        </CardContent>
      </Card>
    </Box>
  )
}

