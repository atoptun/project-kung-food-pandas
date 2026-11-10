import path from 'node:path';
import { fileURLToPath } from 'node:url';

import dotenv from 'dotenv';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load root `.env.local` in local development; Render injects env vars directly in production
dotenv.config({ path: path.resolve(__dirname, '../../.env.local'), quiet: true });
dotenv.config({ quiet: true });

const testDatabaseUrl =
  process.env.TEST_DATABASE_URL ||
  'postgresql://kfp:kfp_local_pass@localhost:5432/kfp_db_test?schema=public';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  plugins: [tsconfigPaths()],
  test: {
    setupFiles: [
      // "./tests/migrate-test.ts", // for migrate the test base before running the tests
      './tests/setup.ts',
    ],
    fileParallelism: false,
    environment: 'node',
    globals: true,
    include: ['tests/**/*.test.ts'],
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: testDatabaseUrl,
      DIRECT_URL: testDatabaseUrl,
      CLOUDINARY_URL: 'cloudinary://test_key:test_secret@test_cloud',
    },
  },
});
