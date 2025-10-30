import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // *** NEW CONFIGURATION FOR PROXY ***
  server: {
    // This setting tells Vite to run the server on port 5173 (standard for Vite)
    port: 5173, 
    // This is the important part: forward all calls starting with /api to the backend URL
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Your Express server address
        changeOrigin: true, // Needed for virtual hosting
        secure: false, // For local development, allows connection without HTTPS
        // rewrite: (path) => path.replace(/^\/api/, ''), // Optional: remove /api prefix if backend doesn't expect it
      },
    },
  },
})
