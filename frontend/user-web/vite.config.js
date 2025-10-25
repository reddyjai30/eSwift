import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
dotenv.config()

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    fs: { allow: ['..', '../../', '../../figma'] },
    proxy: {
      '/api': {
        target: process.env.VITE_PROXY_API || 'http://localhost:5002',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
