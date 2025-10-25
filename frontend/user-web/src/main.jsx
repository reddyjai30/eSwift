import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { SnackbarProvider } from 'notistack'
import './index.css'
import App from './App.jsx'
import { store } from './store/index.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <SnackbarProvider maxSnack={3} autoHideDuration={2500}>
          <App />
        </SnackbarProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
