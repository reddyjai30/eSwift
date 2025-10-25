import { AppBar, Box, Toolbar, Typography, Button, Container, IconButton, Tooltip, useTheme } from '@mui/material'
import { Outlet, useNavigate, Link as RouterLink } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../store/slices/authSlice.js'
import { useContext } from 'react'
import { ColorModeContext } from '../App.jsx'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'

export default function Layout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const theme = useTheme()
  const colorMode = useContext(ColorModeContext)

  const onLogout = () => { dispatch(logout()); navigate('/login', { replace: true }) }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky" elevation={3}>
        <Toolbar disableGutters>
          <Container maxWidth="xl" sx={{ display:'flex', alignItems:'center' }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>eSwift Admin</Typography>
            <Button color="inherit" component={RouterLink} to="/restaurants">Restaurants</Button>
            <Button color="inherit" component={RouterLink} to="/dashboard">Dashboard</Button>
            <Tooltip title={theme.palette.mode === 'light' ? 'Dark mode' : 'Light mode'}>
              <IconButton color="inherit" onClick={colorMode.toggleColorMode} sx={{ mx: 1 }}>
                {theme.palette.mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>
            </Tooltip>
            <Button color="inherit" onClick={onLogout}>Logout</Button>
          </Container>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ py: 4, flex: 1 }}>
        <Outlet />
      </Container>
    </Box>
  )
}
