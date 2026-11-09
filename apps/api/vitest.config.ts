import path from 'node:path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/**/*.test.ts'],
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: 'postgresql://kfp:kfp_local_pass@localhost:5432/kfp_db_test?schema=public',
      DIRECT_URL: 'postgresql://kfp:kfp_local_pass@localhost:5432/kfp_db_test?schema=public',
      CLOUDINARY_URL: 'cloudinary://test_key:test_secret@test_cloud',
    },
  },
});
