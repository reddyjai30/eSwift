import { Box, Button, Typography, Card, CardContent } from '@mui/material'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function Welcome(){
  const navigate = useNavigate()
  return (
    <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:'80vh', px:2 }}>
      <Card sx={{ width:'100%', maxWidth: 480, textAlign:'center', overflow:'hidden' }} component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Box sx={{ background: 'linear-gradient(135deg,#6C5CE7 0%, #00E5FF 100%)', color:'#fff', py:6 }}>
          <Typography variant='h3' sx={{ fontWeight:800, letterSpacing:0.5 }}>eSwift</Typography>
          <Typography variant='subtitle1' sx={{ opacity:0.95 }}>Order faster. Skip the queue.</Typography>
        </Box>
        <CardContent>
          <Typography sx={{ mb:2 }}>Continue with your mobile number</Typography>
          <Button onClick={()=>navigate('/login')} fullWidth variant='contained' sx={{ mb:1 }}>Login</Button>
          <Button onClick={()=>navigate('/signup')} fullWidth variant='outlined'>Sign Up</Button>
        </CardContent>
      </Card>
    </Box>
  )
}

