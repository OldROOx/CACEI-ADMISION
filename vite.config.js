import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

    server: {
        proxy: {
            // Redirige todas las peticiones que empiecen por /api (ej. /api/docentes)
            // al servidor de la API que corre en el puerto 3000.
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                secure: false,
            }
        }
    }
})
