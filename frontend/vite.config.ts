import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Needed for Docker
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://backend:8081',
        changeOrigin: true,
        secure: false,
        ws: true,
        retry: true
      }
    }
  }
})
