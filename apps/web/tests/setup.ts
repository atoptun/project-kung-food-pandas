import '@testing-library/jest-dom/vitest';

import axios from 'axios';
import { afterAll, afterEach, beforeAll } from 'vitest';

import { server } from './mocks/server';

// Configure Axios to use the standard 'fetch' adapter in test/jsdom environment for MSW compatibility
axios.defaults.adapter = 'fetch';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
