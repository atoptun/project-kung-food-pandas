import { fileURLToPath } from 'node:url';

import stylex from '@stylexjs/unplugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const sourceDirectory = fileURLToPath(new URL('./src', import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor';
            }
            if (id.includes('@tanstack/react-query') || id.includes('axios')) {
              return 'query';
            }
            if (id.includes('better-auth')) {
              return 'auth';
            }
          }
        },
      },
    },
  },

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
