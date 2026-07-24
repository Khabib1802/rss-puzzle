import { defineConfig } from 'vite';
import path from 'path';
import sassDts from 'vite-plugin-sass-dts';

export default defineConfig({
  base: '/rss-puzzle/',

  plugins: [
    sassDts({
      esm: true,
      global: {
        generateScopedName: '[name]__[local]___[hash:base64:5]',
      },
    }),
  ],

  resolve: {
    alias: {
      '@styles': path.resolve(__dirname, './src/styles'),
      '@': path.resolve(__dirname, './src'),
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
      },
    },
  },

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
