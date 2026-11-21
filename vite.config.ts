import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // Relative base so the build works on a custom domain and on GitHub Pages project sites alike.
  base: './',
  plugins: [vue()],
  build: {
    // three.js is ~540 kB minified; it is already loaded lazily in its own chunk.
    chunkSizeWarningLimit: 600,
  },
})
