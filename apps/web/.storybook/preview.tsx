import '../src/index.css';

import type { Preview } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { RequestHandler } from 'msw';
import toast from 'react-hot-toast';
import { MemoryRouter } from 'react-router';
import type { IndexEntry } from 'storybook/internal/types';

import Toaster from '../src/components/shared/toaster/toaster';
import { allMockHandlers, worker } from '../src/mocks/browser';

let mswStarted: Promise<ServiceWorkerRegistration | undefined> | null = null;

async function initMsw() {
  if (typeof window === 'undefined') return;

  if (!mswStarted) {
    worker.use(...allMockHandlers);
    mswStarted = worker.start();
  }

  await mswStarted;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const preview: Preview & {
  parameters: {
    options: {
      storySort: (a: IndexEntry, b: IndexEntry) => number;
    };
  };
} = {
  parameters: {
    docs: {
      codePanel: true,
    },
    options: {
      storySort: (a, b) => {
        const aPath = a.title.split('/');
        const bPath = b.title.split('/');

        for (const [i, aPart] of aPath.entries()) {
          const bPart = bPath[i];
          if (bPart === undefined) return 1;
          if (aPart === bPart) continue;

          if (aPart.toLowerCase() === 'responsive') return 1;
          if (bPart.toLowerCase() === 'responsive') return -1;
          return aPart.localeCompare(bPart, undefined, { numeric: true });
        }

        // Parent stories precede nested groups; keep export order within a title.
        return aPath.length - bPath.length;
      },
    },
    viewport: {
      // Widths follow the assignment; heights are convenient preview sizes.
      options: {
        mobileSmall: {
          name: 'Mobile minimum (320px)',
          styles: { width: '320px', height: '568px' },
          type: 'mobile',
        },
        mobile: {
          name: 'Mobile (375px)',
          styles: { width: '375px', height: '812px' },
          type: 'mobile',
        },
        tablet: {
          name: 'Tablet (768px)',
          styles: { width: '768px', height: '1024px' },
          type: 'tablet',
        },
        desktop: {
          name: 'Desktop (1440px)',
          styles: { width: '1440px', height: '900px' },
          type: 'desktop',
        },
      },
    },
  },
  loaders: [
    async ({ parameters }) => {
      await initMsw();
      worker.resetHandlers(...allMockHandlers);
      const storyHandlers: RequestHandler[] = parameters.msw?.handlers ?? [];
      worker.use(...storyHandlers);
      queryClient.clear();
      toast.remove();
    },
  ],

  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Story />
        </MemoryRouter>
        <Toaster />
      </QueryClientProvider>
    ),
  ],
};

export default preview;
