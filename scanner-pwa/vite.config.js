import { defineConfig } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import dotenv from 'dotenv'
dotenv.config()

const certDir = path.resolve(process.cwd(), 'certs')
const keyPath = path.join(certDir, 'key.pem')
const certPath = path.join(certDir, 'cert.pem')

const https = (fs.existsSync(keyPath) && fs.existsSync(certPath))
  ? { key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath) }
  : false

export default defineConfig({
  server: {
    host: true,
    https,
    proxy: {
      // Proxy API calls to the backend so the PWA can stay on HTTPS
      '/api': {
        target: process.env.VITE_PROXY_API || 'http://localhost:5002',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
