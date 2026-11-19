import { setupWorker } from 'msw/browser';

import { handlers } from './handlers';
import { authHandlers } from './handlers/auth';
import { dictionariesHandlers } from './handlers/dictionaries';
import { recipesHandlers } from './handlers/recipes';
import { testimonialsHandlers } from './handlers/testimonials';

declare global {
  interface Window {
    __msw?: {
      worker: typeof worker;
      [key: string]: unknown;
    };
  }
}

export const allMockHandlers = [
  ...authHandlers,
  ...dictionariesHandlers,
  ...recipesHandlers,
  ...testimonialsHandlers,
];

export const worker = setupWorker(...handlers);

export async function enableMocking() {
  if (!import.meta.env.DEV || handlers.length === 0) {
    return;
  }

  await worker.start();

  window.__msw = {
    worker,
    testimonialsHandlers,
    recipesHandlers,
    // DevTools console commands
    mockTestimonials: () => worker.use(...testimonialsHandlers),
    mockRecipes: () => worker.use(...recipesHandlers),
    unmockAll: () => worker.resetHandlers(),
  };
}
