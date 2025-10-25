import { CssBaseline, ThemeProvider } from '@mui/material'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import RestaurantsList from './pages/restaurants/List.jsx'
import RestaurantDetail from './pages/restaurants/Detail.jsx'
import MenuList from './pages/menu/List.jsx'
import MenuForm from './pages/menu/Form.jsx'
import Layout from './components/Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { createContext, useMemo, useState } from 'react'
import { getTheme } from './theme.js'

export const ColorModeContext = createContext({ toggleColorMode: () => {} })

export default function App() {
  const initialMode = (localStorage.getItem('eswift_theme') || 'light')
  const [mode, setMode] = useState(initialMode)
  const colorMode = useMemo(() => ({
    toggleColorMode: () => setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light'; localStorage.setItem('eswift_theme', next); return next
    })
  }), [])
  const theme = useMemo(() => getTheme(mode), [mode])
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/restaurants" element={<RestaurantsList />} />
            <Route path="/restaurants/:id" element={<RestaurantDetail />} />
            <Route path="/restaurants/:id/menu" element={<MenuList />} />
            <Route path="/restaurants/:id/menu/new" element={<MenuForm />} />
            <Route path="/restaurants/:id/menu/:itemId/edit" element={<MenuForm />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}
