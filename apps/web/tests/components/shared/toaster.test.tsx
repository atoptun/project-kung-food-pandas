import { useMutation } from '@tanstack/react-query';
import { act, fireEvent, screen } from '@testing-library/react';
import { AxiosError, AxiosHeaders } from 'axios';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { createQueryClient } from '@/api/query-client';
import Toaster from '@/components/shared/toaster/toaster';
import { notify } from '@/stores/notifications.store';
import { getErrorMessage } from '@/utils/error-message';

import { renderWithProviders } from '../../test-utils';

function FailingMutation() {
  const mutation = useMutation({
    mutationFn: () => Promise.reject(new Error('Saving failed')),
  });

  return (
    <>
      <button type="button" onClick={() => mutation.mutate()}>
        Save
      </button>
      <Toaster />
    </>
  );
}

describe('Notifications', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows an error notification that can be dismissed', () => {
    renderWithProviders({ ui: <Toaster /> });

    act(() => notify.error('Something went wrong'));

    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('hides a notification automatically', () => {
    vi.useFakeTimers();
    renderWithProviders({ ui: <Toaster /> });

    act(() => notify.error('Temporary error'));
    expect(screen.getByRole('alert')).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(6000));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('notifies about failed mutations through the shared query client', async () => {
    renderWithProviders({ ui: <FailingMutation />, queryClient: createQueryClient() });

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Saving failed');
  });

  describe('getErrorMessage', () => {
    it('reads the message from an API error response', () => {
      const error = new AxiosError('Request failed', 'ERR_BAD_REQUEST', undefined, undefined, {
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config: { headers: new AxiosHeaders() },
        data: { status: 'error', message: 'User not found' },
      });

      expect(getErrorMessage(error)).toBe('User not found');
    });

    it('reads Better Auth errors and falls back to a generic message', () => {
      expect(getErrorMessage({ message: 'Invalid email or password', status: 401 })).toBe(
        'Invalid email or password',
      );
      expect(getErrorMessage(null)).toBe('Something went wrong. Please try again.');
    });
  });
});
