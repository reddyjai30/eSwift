import { createTheme, alpha, lighten, darken } from '@mui/material/styles'

export function getTheme(mode = 'light') {
  const isDark = mode === 'dark'
  const primary = { main: '#1976d2' }
  const secondary = { main: '#ff6d00' }

  const bgDefault = isDark ? '#0f172a' : '#f7f9fc'
  const bgPaper = isDark ? '#0b1220' : '#ffffff'

  const theme = createTheme({
    palette: {
      mode,
      primary,
      secondary,
      background: { default: bgDefault, paper: bgPaper }
    },
    shape: { borderRadius: 10 },
    typography: { fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' },
    components: {
      MuiAppBar: { styleOverrides: { root: { backgroundImage: 'none' } } },
      MuiCard: { defaultProps: { elevation: 2 } }
    }
  })

  const p1 = theme.palette.primary.main
  const p2 = isDark ? lighten(p1, 0.15) : lighten(p1, 0.35)
  const s1 = theme.palette.secondary.main
  const s2 = isDark ? lighten(s1, 0.15) : lighten(s1, 0.35)

  theme.custom = {
    heroGradient: `linear-gradient(135deg, ${p1} 0%, ${p2} 50%, ${s2} 100%)`
  }

  return theme
}

