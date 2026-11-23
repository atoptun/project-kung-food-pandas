import rateLimit from 'express-rate-limit';

import env from '@/config/env';

const isTest = env.NODE_ENV === 'test';

export const authRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MINUTES,
  limit: env.RATE_LIMIT_AUTH_MAX,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skip: (req) => isTest || req.method === 'GET', // no blocking for tests or GET requests
  message: {
    message: 'Too many authentication attempts, please try again later.',
  },
});

export const apiRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MINUTES,
  limit: env.RATE_LIMIT_API_MAX,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skip: () => isTest, // no blocking for tests
  message: {
    message: 'Too many requests, please try again later.',
  },
});
