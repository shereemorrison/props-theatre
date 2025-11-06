import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Vite dev server automatically handles SPA routing (all routes serve index.html)
  // For production, use the _redirects file (Netlify) or vercel.json (Vercel)
})


