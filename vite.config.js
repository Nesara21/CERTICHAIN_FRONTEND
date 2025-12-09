import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // 🟢 IMPORTANT: required for Android + Render deployment
  base: "./",

  server: {
    host: '0.0.0.0',
    port: 5173,

    // Proxy only works during dev (npm run dev)
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true
      }
    }
  }
})
