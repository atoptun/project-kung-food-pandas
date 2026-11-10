import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { App } from '@/App';

describe('App', () => {
  it('renders the application heading', () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(() => new Promise(() => {}));

    render(<App />);

    expect(screen.getByRole('heading', { name: /kung food pandas/i })).toBeInTheDocument();
  });
});
