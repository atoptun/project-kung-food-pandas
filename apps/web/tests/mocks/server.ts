import { setupServer } from 'msw/node';

import { authHandlers } from '@/mocks/handlers/auth';
import { dictionariesHandlers } from '@/mocks/handlers/dictionaries';
import { testimonialsHandlers } from '@/mocks/handlers/testimonials';

export const server = setupServer(
  ...testimonialsHandlers,
  ...authHandlers,
  ...dictionariesHandlers,
);
