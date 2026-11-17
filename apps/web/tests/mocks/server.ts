import { setupServer } from 'msw/node';

import { authHandlers } from '@/mocks/handlers/auth';
import { recipesHandlers } from '@/mocks/handlers/recipes';
import { testimonialsHandlers } from '@/mocks/handlers/testimonials';

export const server = setupServer(...testimonialsHandlers, ...authHandlers, ...recipesHandlers);
