import { z } from 'zod';

const ClientEnvSchema = z.object({
  VITE_API_URL: z.url().default('http://localhost:4000'),
  VITE_MOCK_ROUTES: z.string().default(''),
});

export const clientEnv = ClientEnvSchema.parse({
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_MOCK_ROUTES: import.meta.env.VITE_MOCK_ROUTES,
});
