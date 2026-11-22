import { fileURLToPath } from 'node:url';

import stylex from '@stylexjs/unplugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const sourceDirectory = fileURLToPath(new URL('./src', import.meta.url));

export default defineConfig({
  // build: {
  //   rollupOptions: {
  //     output: {
  //       manualChunks(id) {
  //         if (!id.includes('node_modules')) {
  //           return;
  //         }

  //         if (/[\\/]node_modules[\\/](react|react-dom|react-router)[\\/]/.test(id)) {
  //           return 'vendor';
  //         }
  //         if (/[\\/]node_modules[\\/](@tanstack\/react-query|axios)[\\/]/.test(id)) {
  //           return 'query';
  //         }
  //         if (/[\\/]node_modules[\\/]better-auth[\\/]/.test(id)) {
  //           return 'auth';
  //         }
  //       },
  //     },
  //   },
  // },

  plugins: [
    stylex.vite({
      useCSSLayers: { before: ['reset'] },
      aliases: {
        '@/*': [`${sourceDirectory}/*`],
      },
      unstable_moduleResolution: {
        type: 'commonJS',
      },
    }),
    react(),
  ],
  // Load `.env.local` from the monorepo root directory
  envDir: '../../',
  resolve: {
    alias: {
      '@': sourceDirectory,
    },
  },
  server: {
    port: 5173,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
    teardownTimeout: 1000,
    pool: 'threads',
  },
});
