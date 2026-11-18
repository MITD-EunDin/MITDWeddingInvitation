import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [
        '@supabase/supabase-js',
        'firebase/app',
        'firebase/firestore',
        'firebase/auth',
      ],
    },
  },
})
