import { Box, Button, Typography, Card, CardContent } from '@mui/material'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function Welcome(){
  const navigate = useNavigate()
  return (
    <Box sx={{ position:'relative', minHeight:'84vh', display:'flex', alignItems:'center', justifyContent:'center', px:2 }}>
      <div className='backdrop-blobs'>
        <div className='blob primary' />
        <div className='blob accent' />
      </div>
      <Card sx={{ width:'100%', maxWidth: 620, textAlign:'center', overflow:'hidden', position:'relative', zIndex:1 }} component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Box className='animated-gradient-bar' />
        <CardContent>
          <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', py:4 }}>
            <Box sx={{ width:96, height:96, borderRadius:'50%', background:'linear-gradient(135deg,#6C5CE7 0%, #EC4899 100%)', boxShadow:3 }} />
          </Box>
          <Typography variant='h4' sx={{ fontWeight:800, letterSpacing:0.3, mb:1 }}>Scan QR at Counter</Typography>
          <Typography color='text.secondary' sx={{ maxWidth:520, mx:'auto', mb:3 }}>Simply scan the QR code displayed at your table or counter to start ordering</Typography>
          <Box sx={{ display:'flex', gap:1, justifyContent:'center', mb:2 }}>
            <Box sx={{ width:28, height:6, borderRadius:999, background:'var(--gradient-primary)' }} />
            <Box sx={{ width:6, height:6, borderRadius:'50%', background:'var(--surface)' }} />
            <Box sx={{ width:6, height:6, borderRadius:'50%', background:'var(--surface)' }} />
          </Box>
          <Button onClick={()=>navigate('/login')} fullWidth variant='contained' sx={{ py:1.4, fontWeight:800, background: 'linear-gradient(135deg,#6C5CE7 0%, #00E5FF 100%)', boxShadow: 3 }}>Next</Button>
          <Typography sx={{ mt:2 }} color='text.secondary'>Already have an account? <Button size='small' onClick={()=>navigate('/login')}>Log in</Button></Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
