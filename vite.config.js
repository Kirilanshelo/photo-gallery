import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { imagetools } from 'vite-imagetools'

export default defineConfig({
  plugins: [vue(), imagetools()],
  base: '/photo-gallery/',
})
