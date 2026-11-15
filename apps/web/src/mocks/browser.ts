import { setupWorker } from 'msw/browser';

import { handlers } from './handlers';
import { testimonialsHandlers } from './handlers/testimonials';

declare global {
  interface Window {
    __msw?: {
      worker: typeof worker;
      [key: string]: unknown;
    };
  }
}

export const worker = setupWorker(...handlers);

export async function enableMocking() {
  if (!import.meta.env.DEV || handlers.length === 0) {
    return;
  }

  await worker.start();

  window.__msw = {
    worker,
    testimonialsHandlers,
    // DevTools console commands
    mockTestimonials: () => worker.use(...testimonialsHandlers),
    unmockAll: () => worker.resetHandlers(),
  };
}
