import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { App } from '@/App';

describe('App', () => {
  it('opens the home page at /', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(document.title).toBe('Home | Foodies');
    });
  });

  it('renders the recipe page at /recipe/:id', async () => {
    render(
      <MemoryRouter initialEntries={['/recipe/1']}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(document.title).toBe('Recipe | Foodies');
    });
  });

  it('renders the recipe add page at /recipe/add', async () => {
    render(
      <MemoryRouter initialEntries={['/recipe/add']}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(document.title).toBe('Recipe Add | Foodies');
    });
  });

  it('opens the user profile at /user/:id', async () => {
    render(
      <MemoryRouter initialEntries={['/user/1']}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(document.title).toBe('User Profile | Foodies');
    });
  });

  it('renders the not found page at /*', async () => {
    render(
      <MemoryRouter initialEntries={['/not-exist-page']}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(document.title).toBe('Not Found | Foodies');
    });
  });
});
