import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      'gsap',
      'gsap/ScrollTrigger',
      'lucide-react',
      'motion',
      'react-router-dom',
    ],
  },
  server: {
    port: 5173,
    fs: {
      strict: false,
    },
  },
})
