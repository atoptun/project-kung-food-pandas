import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { bearer, openAPI } from 'better-auth/plugins';

import env from '@/config/env';
import prisma from '@/lib/prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  advanced: {
    database: {
      joins: true,
    },
  },
  user: {
    fields: {
      image: 'avatar',
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [bearer(), openAPI()],
});
