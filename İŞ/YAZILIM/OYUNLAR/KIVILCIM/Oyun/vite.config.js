import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  publicDir: false,
  build: { outDir: 'dist', assetsInlineLimit: 0, emptyOutDir: false },
  server: { host: '127.0.0.1', port: 5173, strictPort: true },
  preview: { host: '127.0.0.1', port: 4173, strictPort: true },
});
