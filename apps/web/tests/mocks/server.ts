import { setupServer } from 'msw/node';

import { authHandlers } from '@/mocks/handlers/auth';
import { testimonialsHandlers } from '@/mocks/handlers/testimonials';

export const server = setupServer(...testimonialsHandlers, ...authHandlers);
