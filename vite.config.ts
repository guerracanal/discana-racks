import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/albums': {
        target: 'https://discana-api-346921755711.europe-west1.run.app',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/albums/, '/albums')
      }
    }
  }
});
