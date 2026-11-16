import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { delay, http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { mockAuthAccount, mockAuthPassword } from '@/mocks/handlers/auth';
import { useAuthModalStore } from '@/stores/auth-modal.store';

import { server } from '../mocks/server';
import { renderWithProviders } from '../test-utils';

function getBanner() {
  return screen.getByRole('banner');
}

async function openSignIn() {
  fireEvent.click(await within(getBanner()).findByRole('button', { name: 'Sign in' }));
  return screen.findByRole('dialog', { name: 'Sign in' });
}

async function openSignUp() {
  fireEvent.click(await within(getBanner()).findByRole('button', { name: 'Sign up' }));
  return screen.findByRole('dialog', { name: 'Sign up' });
}

function fill(dialog: HTMLElement, label: string, value: string) {
  fireEvent.change(within(dialog).getByLabelText(label), { target: { value } });
}

describe('Authentication', () => {
  describe('session check', () => {
    it('does not show a guest decision while the session is being checked', async () => {
      server.use(
        http.get('*/api/auth/get-session', async () => {
          await delay('infinite');
          return HttpResponse.json(null);
        }),
      );

      renderWithProviders();

      expect(await within(getBanner()).findByRole('status')).toBeInTheDocument();
      expect(
        within(getBanner()).queryByRole('button', { name: 'Sign in' }),
      ).not.toBeInTheDocument();
      expect(
        within(getBanner()).queryByRole('button', { name: 'Sign up' }),
      ).not.toBeInTheDocument();
    });

    it('shows Sign in and Sign up for a guest', async () => {
      renderWithProviders();

      expect(
        await within(getBanner()).findByRole('button', { name: 'Sign in' }),
      ).toBeInTheDocument();
      expect(within(getBanner()).getByRole('button', { name: 'Sign up' })).toBeInTheDocument();
    });

    it('restores an existing session and shows the user bar', async () => {
      renderWithProviders({ user: mockAuthAccount });

      expect(
        await within(getBanner()).findByRole('button', { name: /victoria/i }),
      ).toBeInTheDocument();
      expect(
        within(getBanner()).queryByRole('button', { name: 'Sign in' }),
      ).not.toBeInTheDocument();
    });
  });

  describe('sign in', () => {
    it('validates fields on submit and does not call the API with invalid data', async () => {
      let signInCalls = 0;
      server.events.on('request:start', ({ request }) => {
        if (request.url.includes('/sign-in/email')) signInCalls += 1;
      });

      renderWithProviders();
      const dialog = await openSignIn();

      expect(within(dialog).queryByText('Email is required')).not.toBeInTheDocument();

      fireEvent.click(within(dialog).getByRole('button', { name: 'Sign in' }));

      expect(await within(dialog).findByText('Email is required')).toBeInTheDocument();
      expect(within(dialog).getByText('Password is required')).toBeInTheDocument();
      expect(within(dialog).getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');

      fill(dialog, 'Email', 'not-an-email');
      fill(dialog, 'Password', '123');
      fireEvent.click(within(dialog).getByRole('button', { name: 'Sign in' }));

      expect(await within(dialog).findByText('Enter a valid email')).toBeInTheDocument();
      expect(
        within(dialog).getByText('Password must be at least 8 characters'),
      ).toBeInTheDocument();
      expect(signInCalls).toBe(0);

      server.events.removeAllListeners();
    });

    it('toggles password visibility', async () => {
      renderWithProviders();
      const dialog = await openSignIn();

      const password = within(dialog).getByLabelText('Password');
      expect(password).toHaveAttribute('type', 'password');

      fireEvent.click(within(dialog).getByRole('button', { name: 'Show password' }));
      expect(password).toHaveAttribute('type', 'text');
    });

    it('signs in, closes the dialog and shows the user bar', async () => {
      renderWithProviders();
      const dialog = await openSignIn();

      fill(dialog, 'Email', mockAuthAccount.email);
      fill(dialog, 'Password', mockAuthPassword);
      fireEvent.click(within(dialog).getByRole('button', { name: 'Sign in' }));

      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
      expect(
        await within(getBanner()).findByRole('button', { name: /victoria/i }),
      ).toBeInTheDocument();
    });

    it('shows the API error and keeps the dialog open on wrong credentials', async () => {
      renderWithProviders();
      const dialog = await openSignIn();

      fill(dialog, 'Email', mockAuthAccount.email);
      fill(dialog, 'Password', 'WrongPass123!');
      fireEvent.click(within(dialog).getByRole('button', { name: 'Sign in' }));

      expect(await within(dialog).findByRole('alert')).toHaveTextContent(
        'Invalid email or password',
      );
      expect(screen.getByRole('dialog', { name: 'Sign in' })).toBeInTheDocument();
    });

    it('switches to the sign up form', async () => {
      renderWithProviders();
      const dialog = await openSignIn();

      fireEvent.click(within(dialog).getByRole('button', { name: 'Create an account' }));

      expect(await screen.findByRole('dialog', { name: 'Sign up' })).toBeInTheDocument();
    });
  });

  describe('sign up', () => {
    it('validates fields on submit', async () => {
      renderWithProviders();
      const dialog = await openSignUp();

      fill(dialog, 'Name', 'P');
      fireEvent.click(within(dialog).getByRole('button', { name: 'Create' }));

      expect(
        await within(dialog).findByText('Name must be at least 2 characters'),
      ).toBeInTheDocument();
      expect(within(dialog).getByText('Email is required')).toBeInTheDocument();
      expect(within(dialog).getByText('Password is required')).toBeInTheDocument();
    });

    it('registers, closes the dialog and shows the new user', async () => {
      renderWithProviders();
      const dialog = await openSignUp();

      fill(dialog, 'Name', 'Panda');
      fill(dialog, 'Email', 'panda@foodies.com');
      fill(dialog, 'Password', 'StrongPass123!');
      fireEvent.click(within(dialog).getByRole('button', { name: 'Create' }));

      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
      expect(
        await within(getBanner()).findByRole('button', { name: /panda/i }),
      ).toBeInTheDocument();
    });

    it('shows the API error when the email is taken', async () => {
      renderWithProviders();
      const dialog = await openSignUp();

      fill(dialog, 'Name', 'Victoria');
      fill(dialog, 'Email', mockAuthAccount.email);
      fill(dialog, 'Password', 'StrongPass123!');
      fireEvent.click(within(dialog).getByRole('button', { name: 'Create' }));

      expect(await within(dialog).findByRole('alert')).toHaveTextContent(
        'User already exists. Use another email.',
      );
    });

    it('switches back to the sign in form', async () => {
      renderWithProviders();
      const dialog = await openSignUp();

      fireEvent.click(within(dialog).getByRole('button', { name: 'Sign in' }));

      expect(await screen.findByRole('dialog', { name: 'Sign in' })).toBeInTheDocument();
    });
  });

  describe('user bar and logout', () => {
    async function openUserMenu() {
      const trigger = await within(getBanner()).findByRole('button', { name: /victoria/i });
      fireEvent.click(trigger);
      return { trigger, menu: within(getBanner()).getByRole('menu') };
    }

    it('opens the user menu with a profile link and closes it on Escape', async () => {
      renderWithProviders({ user: mockAuthAccount });

      const { trigger, menu } = await openUserMenu();

      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(within(menu).getByRole('menuitem', { name: 'Profile' })).toHaveAttribute(
        'href',
        `/user/${mockAuthAccount.id}`,
      );

      fireEvent.keyDown(menu, { key: 'Escape' });

      expect(within(getBanner()).queryByRole('menu')).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    });

    it('cancels logout from the confirmation dialog', async () => {
      renderWithProviders({ user: mockAuthAccount });

      const { menu } = await openUserMenu();
      fireEvent.click(within(menu).getByRole('menuitem', { name: 'Log out' }));

      const dialog = await screen.findByRole('dialog', { name: 'Are you logging out?' });
      fireEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }));

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(within(getBanner()).getByRole('button', { name: /victoria/i })).toBeInTheDocument();
    });

    it('logs out, clears client state and navigates home', async () => {
      const { queryClient, router } = renderWithProviders({
        user: mockAuthAccount,
        initialEntries: ['/recipe/add'],
      });
      queryClient.setQueryData(['private-data'], { secret: true });
      localStorage.setItem('draft', 'value');

      const { menu } = await openUserMenu();
      fireEvent.click(within(menu).getByRole('menuitem', { name: 'Log out' }));
      const dialog = await screen.findByRole('dialog', { name: 'Are you logging out?' });
      fireEvent.click(within(dialog).getByRole('button', { name: 'Log out' }));

      expect(
        await within(getBanner()).findByRole('button', { name: 'Sign in' }),
      ).toBeInTheDocument();
      expect(router.state.location.pathname).toBe('/');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(queryClient.getQueryData(['private-data'])).toBeUndefined();
      expect(localStorage.getItem('draft')).toBeNull();
    });

    it('still clears the client session when the logout request fails', async () => {
      server.use(http.post('*/api/auth/sign-out', () => HttpResponse.error()));
      const { router } = renderWithProviders({
        user: mockAuthAccount,
        initialEntries: ['/recipe/add'],
      });
      localStorage.setItem('draft', 'value');

      const { menu } = await openUserMenu();
      fireEvent.click(within(menu).getByRole('menuitem', { name: 'Log out' }));
      const dialog = await screen.findByRole('dialog', { name: 'Are you logging out?' });
      fireEvent.click(within(dialog).getByRole('button', { name: 'Log out' }));

      expect(
        await within(getBanner()).findByRole('button', { name: 'Sign in' }),
      ).toBeInTheDocument();
      expect(router.state.location.pathname).toBe('/');
      expect(localStorage.getItem('draft')).toBeNull();
    });
  });

  describe('shared auth modal', () => {
    it('can be opened from anywhere through the store', async () => {
      renderWithProviders();
      await within(getBanner()).findByRole('button', { name: 'Sign in' });

      useAuthModalStore.getState().openSignIn();

      expect(await screen.findByRole('dialog', { name: 'Sign in' })).toBeInTheDocument();
    });
  });
});
