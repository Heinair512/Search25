import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/',
  server: {
    host: 'localhost',
    port: 5173,
    https: false,
    hmr: {
      protocol: 'ws',
      host: 'localhost'
    }
  }
})