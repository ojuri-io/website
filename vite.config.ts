import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Custom domain via CNAME — base stays at '/'.
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    port: Number(process.env.PORT) || 5173,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
