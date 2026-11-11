import { fileURLToPath } from 'node:url';

import stylex from '@stylexjs/unplugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const sourceDirectory = fileURLToPath(new URL('./src', import.meta.url));

export default defineConfig({
  plugins: [
    stylex.vite({
      useCSSLayers: true,
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
  },
});
