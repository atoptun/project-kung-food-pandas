import type { RequestHandler } from 'msw';

import { clientEnv } from '@/env';

import { authHandlers } from './handlers/auth';
import { dictionariesHandlers } from './handlers/dictionaries';
import { recipesHandlers } from './handlers/recipes';
import { testimonialsHandlers } from './handlers/testimonials';

const mockScopes = (clientEnv.VITE_MOCK_ROUTES || '').split(',').map((s: string) => s.trim());

const isMockEnabled = (scope: string) => mockScopes.includes('all') || mockScopes.includes(scope);

export const handlers: RequestHandler[] = [
  ...(isMockEnabled('auth') ? authHandlers : []),
  ...(isMockEnabled('dictionaries') ? dictionariesHandlers : []),
  ...(isMockEnabled('recipes') ? recipesHandlers : []),
  ...(isMockEnabled('testimonials') ? testimonialsHandlers : []),
];
