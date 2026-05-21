import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Custom domain via CNAME — base stays at '/'.
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
