import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import Button from '@/components/shared/button/button';

import { renderWithProviders } from '../../test-utils';

describe('Button', () => {
  it('renders children correctly', () => {
    renderWithProviders({ ui: <Button>Click me</Button> });

    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();

    renderWithProviders({ ui: <Button onClick={handleClick}>Submit</Button> });

    const button = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('respects disabled attribute and does not trigger click', () => {
    const handleClick = vi.fn();

    renderWithProviders({
      ui: (
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>
      ),
    });

    const button = screen.getByRole('button', { name: /disabled/i });
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders with custom type submit', () => {
    renderWithProviders({ ui: <Button type="submit">Submit Form</Button> });

    expect(screen.getByRole('button', { name: /submit form/i })).toHaveAttribute('type', 'submit');
  });
});
