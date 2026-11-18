import '@testing-library/jest-dom/vitest';

import { cleanup, configure } from '@testing-library/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';

import { apiClient } from '@/api/client';
import { resetMockAuth } from '@/mocks/handlers/auth';
import { resetMockFavorites } from '@/mocks/handlers/recipes';
import { useAuthModalStore } from '@/stores/auth-modal.store';
import { useUIStore } from '@/stores/ui.store';

import { server } from './mocks/server';
import { resetAuthSession } from './test-utils';

// Configure Axios to use the standard 'fetch' adapter in test/jsdom environment for MSW compatibility
axios.defaults.adapter = 'fetch';
// Imports above are hoisted, so `apiClient` may already exist with the default adapter.
apiClient.defaults.adapter = 'fetch';

// CI runs every package's tests in parallel; lazy pages and MSW responses can take longer than
// the default 1s there, which made `findBy*`/`waitFor` flaky. Real hangs still fail after 5s.
configure({ asyncUtilTimeout: 5000 });

// jsdom has no matchMedia; react-hot-toast reads prefers-reduced-motion through it.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

beforeAll(() => server.listen());

beforeEach(() => {
  resetMockAuth();
  resetMockFavorites();
  resetAuthSession();
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
  useAuthModalStore.getState().close();
  toast.remove();
  useUIStore.getState().closeMobileMenu();
  localStorage.clear();
  document.body.style.overflow = '';
});

afterAll(() => server.close());
