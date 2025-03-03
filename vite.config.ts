import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {  // Cambiamos el endpoint base
        target: 'https://discana-api-346921755711.europe-west1.run.app',
        changeOrigin: true,
        secure: true,  // Habilitamos SSL
        rewrite: (path) => path.replace(/^\/api/, ''),
        ws: true
      }
    }
  }
})