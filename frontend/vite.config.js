import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',        // Escucha en todas las interfaces de la máquina virtual
    port: 5173,             // Volvemos al puerto oficial
    strictPort: true,
    allowedHosts: true,     // Permite cualquier host (Vital para el nuevo parche de seguridad de Vite)
    cors: true,             // Permite cruce de datos
    hmr: {
      clientPort: 443       // ¡ESTA ES LA CLAVE! Obliga al túnel web socket a usar HTTPS estándar
    }
  }
})