import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import axios from 'axios';
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';

import { resetMockAuth } from '@/mocks/handlers/auth';
import { useAuthModalStore } from '@/stores/auth-modal.store';
import { useNotificationsStore } from '@/stores/notifications.store';
import { useUIStore } from '@/stores/ui.store';

import { server } from './mocks/server';
import { resetAuthSession } from './test-utils';

// Configure Axios to use the standard 'fetch' adapter in test/jsdom environment for MSW compatibility
axios.defaults.adapter = 'fetch';

beforeAll(() => server.listen());

beforeEach(() => {
  resetMockAuth();
  resetAuthSession();
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
  useAuthModalStore.getState().close();
  useNotificationsStore.setState({ notifications: [] });
  useUIStore.getState().closeMobileMenu();
  localStorage.clear();
  document.body.style.overflow = '';
});

afterAll(() => server.close());
