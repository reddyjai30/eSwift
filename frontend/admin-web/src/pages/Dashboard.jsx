import { Box, Button, Card, CardActions, CardContent, Grid, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Link as RouterLink } from 'react-router-dom'

export default function Dashboard() {
  const theme = useTheme()
  return (
    <Box>
      <Box sx={{
        background: theme.custom?.heroGradient,
        color: '#fff', borderRadius: 2, p: 4, mb: 3
      }}>
        <Typography variant='h3' sx={{ fontWeight: 600, mb: 1 }}>Welcome to eSwift Admin</Typography>
        <Typography variant='h6' sx={{ opacity: 0.95, mb: 2 }}>Manage restaurants, menus, and images with ease.</Typography>
        <Button component={RouterLink} to='/restaurants' variant='contained' color='secondary'>Go to Restaurants</Button>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6'>Quick Start</Typography>
              <Typography color='text.secondary'>Add your restaurant, then create menu items and upload images.</Typography>
            </CardContent>
            <CardActions>
              <Button component={RouterLink} to='/restaurants' variant='contained'>Add Restaurant</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant='h6'>Tips</Typography>
              <Typography color='text.secondary'>Use the menu editor to set quantity and keep stock in sync.</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
