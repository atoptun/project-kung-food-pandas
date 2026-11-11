import path from 'node:path';
import { fileURLToPath } from 'node:url';

import dotenv from 'dotenv';
import { defineConfig } from 'prisma/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, '../../.env.local'), quiet: true });
dotenv.config({ quiet: true });

// Use DIRECT_URL for Prisma CLI operations (migrations/introspection) to bypass Neon PgBouncer pooling
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url:
      process.env.DIRECT_URL ??
      process.env.DATABASE_URL ??
      'postgresql://kfp:kfp_local_pass@localhost:5432/kfp_db?schema=public',
  },
});
