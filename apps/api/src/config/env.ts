import path from 'node:path';
import { fileURLToPath } from 'node:url';

import dotenv from 'dotenv';
import { z } from 'zod';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load root `.env.local` in local development; Render injects env vars directly in production
dotenv.config({ path: path.resolve(__dirname, '../../../../.env.local'), quiet: true });
dotenv.config({ quiet: true });

const EnvSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(4000),
    LOG_LEVEL: z
      .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
      .default('info'),
    CORS_ORIGINS: z
      .string()
      .default('http://localhost:5173')
      .transform((value) =>
        value
          .split(',')
          .map((origin) => origin.trim())
          .filter((origin) => origin.length > 0),
      )
      .pipe(z.array(z.url({ error: 'Each origin must be a valid URL' }))),
    DATABASE_URL: z
      .url()
      .default('postgresql://kfp:kfp_local_pass@localhost:5432/kfp_db?schema=public'),
    DIRECT_URL: z
      .url()
      .default('postgresql://kfp:kfp_local_pass@localhost:5432/kfp_db?schema=public'),
    // CLOUDINARY_CLOUD_NAME: z.string().default('demo'),
    // CLOUDINARY_API_KEY: z.string().default('demo_key'),
    // CLOUDINARY_API_SECRET: z.string().default('demo_secret'),
    CLOUDINARY_URL: z
      .url()
      .startsWith('cloudinary://', {
        message: 'CLOUDINARY_URL must start with cloudinary://',
      })
      .default('cloudinary://demo_key:demo_secret@demo'),
  })
  .transform((data) => ({
    ...data,
    IS_DEV: data.NODE_ENV === 'development',
    IS_TEST: data.NODE_ENV === 'test',
    IS_PROD: data.NODE_ENV === 'production',
  }));

const parsedEnv = EnvSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('Invalid environment configuration:', z.flattenError(parsedEnv.error).fieldErrors);
  process.exit(1);
}

const env = parsedEnv.data;

export default env;
