import { setupServer } from 'msw/node';

import { authHandlers } from '@/mocks/handlers/auth';
import { dictionariesHandlers } from '@/mocks/handlers/dictionaries';
import { recipesHandlers } from '@/mocks/handlers/recipes';
import { testimonialsHandlers } from '@/mocks/handlers/testimonials';

export const server = setupServer(
  ...authHandlers,
  ...dictionariesHandlers,
  ...recipesHandlersб
  ...testimonialsHandlers,
);
