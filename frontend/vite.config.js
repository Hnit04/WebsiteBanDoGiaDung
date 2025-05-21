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
    port: 5174,
    proxy: {
      '/api': {
        target: 'https://websitebandogiadung.onrender.com/',
        changeOrigin: true,
        // Bỏ rewrite để giữ /api/users
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});