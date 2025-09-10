import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
        host: '0.0.0.0', // Binds to all available network interfaces
        port: 3000,     // Sets the primary port
        // Optionally, if you want to try an alternative port if 5173 is busy:
        // strictPort: false, // Allows Vite to try the next available port if the specified one is busy
        // or
        // port: 3000, // If you prefer port 3000 instead of 5173
      },
})
