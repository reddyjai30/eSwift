import { AppBar, Toolbar, Typography, IconButton, Badge, Container, Menu as MuiMenu, MenuItem, Tooltip } from '@mui/material'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useTheme } from '@mui/material/styles'
import React, { useContext } from 'react'
import { ColorModeContext } from '../App.jsx'
import { useEffect } from 'react'
import { loadCart } from '../store/slices/cart.js'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { logout } from '../store/slices/auth.js'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'

export default function Shell(){
  const navigate = useNavigate()
  const cart = useSelector(s=>s.cart.data)
  const dispatch = useDispatch()
  const count = cart?.items?.reduce((s,i)=>s+i.quantity,0) || 0
  const theme = useTheme()
  const color = useContext(ColorModeContext)
  useEffect(()=>{ dispatch(loadCart()) },[dispatch])
  const loc = useLocation()
  const showBack = !['/restaurants','/welcome','/cart','/profile'].includes(loc.pathname)
  const [anchor, setAnchor] = React.useState(null)
  const open = Boolean(anchor)
  const handleMenu = (e)=> setAnchor(e.currentTarget)
  const close = ()=> setAnchor(null)
  const toProfile = ()=> { close(); navigate('/profile') }
  const doLogout = ()=> { close(); dispatch(logout()); navigate('/welcome', { replace:true }) }
  return (
    <>
      <AppBar position="sticky" color="transparent" sx={{ backdropFilter:'blur(8px)' }}>
        <Toolbar>
          {showBack && (
            <IconButton
              aria-label="Back"
              onClick={()=>navigate(-1)}
              sx={{ mr: 1, background: 'linear-gradient(135deg,#6C5CE7 0%, #00E5FF 100%)', color:'#fff', '&:hover':{ opacity:0.9 }, boxShadow: 2 }}
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
          )}
          <Typography
            variant="h6"
            onClick={()=>navigate('/restaurants')}
            sx={{ flexGrow:1, fontWeight:700, cursor:'pointer', userSelect:'none' }}
            title="Go to Home"
          >
            eSwift
          </Typography>
          <IconButton color="inherit" onClick={()=>navigate('/orders')}>
            <ReceiptLongIcon />
          </IconButton>
          <IconButton color="inherit" onClick={()=>navigate('/wallet')}>
            <AccountBalanceWalletIcon />
          </IconButton>
          <IconButton color="inherit" onClick={()=>navigate('/cart')}>
            <Badge color="secondary" badgeContent={count}><ShoppingBagIcon /></Badge>
          </IconButton>
          <IconButton color="inherit" onClick={color.toggle}>
            {theme.palette.mode==='light'?<Brightness4Icon/>:<Brightness7Icon/>}
          </IconButton>
          <Tooltip title="Account">
            <IconButton color="inherit" onClick={handleMenu}><AccountCircleIcon /></IconButton>
          </Tooltip>
          <MuiMenu anchorEl={anchor} open={open} onClose={close} anchorOrigin={{ vertical:'bottom', horizontal:'right' }} transformOrigin={{ vertical:'top', horizontal:'right' }}>
            <MenuItem onClick={toProfile}>Profile</MenuItem>
            <MenuItem onClick={doLogout}>Logout</MenuItem>
          </MuiMenu>
        </Toolbar>
      </AppBar>
      <Container maxWidth={{ xs: 'sm', md: 'md' }} sx={{ py: { xs: 2, md: 3 } }}>
        <Outlet />
      </Container>
    </>
  )
}
