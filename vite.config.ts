// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // 1. Listen on all interfaces (required for ngrok to connect)
    host: '0.0.0.0', 
    
    // 2. Allow all hostnames (prevents the "Blocked request" error)
    allowedHosts: 'all',
    
    // 3. Enable broad CORS rules for development
    cors: true,
    
    // 4. Configure HMR to work over the HTTPS tunnel
    hmr: {
        // Use port 443, as ngrok tunnels to HTTPS
        clientPort: 443, 
    }
  }
})