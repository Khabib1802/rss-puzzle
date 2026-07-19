import { defineConfig } from 'vite';

export default defineConfig({
  base: '/rss-puzzle/',
  server: {
    host: '127.0.0.1',
    port: 5173,
    open: true,
    strictPort: false,
  },
  build: {
    target: 'ES2022',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['normalize-scss'],
        },
      },
    },
  },
  test: { environment: 'jsdom', coverage: { provider: 'v8' } },
  preview: {
    port: 4173,
  },
});
