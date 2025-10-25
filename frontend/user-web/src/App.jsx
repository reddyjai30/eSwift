import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useMemo, useState, createContext } from 'react'
import Login from './pages/auth/Login.jsx'
import Signup from './pages/auth/Signup.jsx'
import Welcome from './pages/auth/Welcome.jsx'
import Otp from './pages/auth/Otp.jsx'
import Restaurants from './pages/Restaurants.jsx'
import Menu from './pages/Menu.jsx'
import Cart from './pages/Cart.jsx'
import Profile from './pages/Profile.jsx'
import OrderQr from './pages/OrderQr.jsx'
import Orders from './pages/Orders.jsx'
import Wallet from './pages/Wallet.jsx'
import OrderDetails from './pages/OrderDetails.jsx'
import Protected from './components/Protected.jsx'
import ShellFigma from './components/ShellFigma.jsx'

export const ColorModeContext = createContext({ toggle: () => {} })

export default function App(){
  const [mode, setMode] = useState(localStorage.getItem('eswift_theme') || 'light')
  const color = useMemo(() => ({ toggle: () => setMode(m => { const n=m==='light'?'dark':'light'; localStorage.setItem('eswift_theme', n); return n }) }), [])
  const theme = useMemo(() => createTheme({ palette:{ mode, primary:{ main:'#6C5CE7' }, secondary:{ main:'#00E5FF' }, background:{ default: mode==='light'?'#fafbff':'#0f1220', paper: mode==='light'?'#fff':'#0b0f1a' } }, shape:{ borderRadius:12 } }), [mode])

  return (
    <ColorModeContext.Provider value={color}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<Navigate to="/welcome" replace />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/otp" element={<Otp />} />
          <Route element={<Protected><ShellFigma /></Protected>}>
            <Route index element={<Navigate to="/restaurants" replace />} />
            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/restaurants/:id/menu" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/orders/:id/qr" element={<OrderQr />} />
            <Route path="/wallet" element={<Wallet />} />
          </Route>
          <Route path="*" element={<Navigate to="/welcome" replace />} />
        </Routes>
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}
