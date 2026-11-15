import axios from 'axios';

import { clientEnv } from '@/env';

export const apiClient = axios.create({
  baseURL: clientEnv.VITE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO: API Errors handler
    return Promise.reject(error);
  },
);
