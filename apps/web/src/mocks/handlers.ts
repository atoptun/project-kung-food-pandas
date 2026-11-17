import type { RequestHandler } from 'msw';

import { clientEnv } from '@/env';

import { dictionariesHandlers } from './handlers/dictionaries';
import { testimonialsHandlers } from './handlers/testimonials';

const mockScopes = (clientEnv.VITE_MOCK_ROUTES || '').split(',').map((s: string) => s.trim());

const isMockEnabled = (scope: string) => mockScopes.includes('all') || mockScopes.includes(scope);

export const handlers: RequestHandler[] = [
  ...(isMockEnabled('dictionaries') ? dictionariesHandlers : []),
  ...(isMockEnabled('testimonials') ? testimonialsHandlers : []),
];
