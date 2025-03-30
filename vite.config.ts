import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/numbers-game/',
  build: {
    // Ensure source maps are generated
    sourcemap: true,
    // Output to the dist folder
    outDir: 'dist',
    // Generate a manifest for better understanding of asset mapping
    manifest: true,
    // Ensure Vite processes HTML properly
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
})