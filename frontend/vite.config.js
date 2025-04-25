import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Proxy đến API Gateway
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'), // Giữ nguyên /api trong URL
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});