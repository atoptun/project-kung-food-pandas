import { setupServer } from 'msw/node';

import { testimonialsHandlers } from '@/mocks/handlers/testimonials';

export const server = setupServer(...testimonialsHandlers);
