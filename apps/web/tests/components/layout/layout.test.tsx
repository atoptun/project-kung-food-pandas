import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { mockAuthAccount } from '@/mocks/handlers/auth';

import { renderWithProviders } from '../../test-utils';

describe('Layout', () => {
  describe('Header', () => {
    it('renders the logo linking home and the main navigation', async () => {
      renderWithProviders({ initialEntries: ['/recipe/1'] });

      const banner = screen.getByRole('banner');
      expect(within(banner).getByRole('link', { name: 'Foodies home' })).toHaveAttribute(
        'href',
        '/',
      );

      const nav = within(banner).getByRole('navigation', { name: 'Main' });
      expect(within(nav).getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
      expect(within(nav).getByRole('link', { name: 'Add recipe' })).toHaveAttribute(
        'href',
        '/recipe/add',
      );
    });

    it('marks the current page link', async () => {
      renderWithProviders({ user: mockAuthAccount, initialEntries: ['/recipe/add'] });

      const nav = within(screen.getByRole('banner')).getByRole('navigation', { name: 'Main' });

      expect(await within(nav).findByRole('link', { name: 'Add recipe' })).toHaveAttribute(
        'aria-current',
        'page',
      );
      expect(within(nav).getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
    });
  });

  describe('Mobile menu', () => {
    it('is not offered to guests', async () => {
      renderWithProviders();

      await within(screen.getByRole('banner')).findByRole('button', { name: 'Sign in' });

      expect(screen.queryByRole('button', { name: 'Open menu' })).not.toBeInTheDocument();
    });

    it('opens, closes on Escape and returns focus to the burger', async () => {
      renderWithProviders({ user: mockAuthAccount });

      const burger = await screen.findByRole('button', { name: 'Open menu' });
      expect(burger).toHaveAttribute('aria-expanded', 'false');

      burger.focus();
      fireEvent.click(burger);

      const menu = screen.getByRole('dialog', { name: 'Menu' });
      expect(within(menu).getByRole('link', { name: 'Home' })).toBeInTheDocument();
      expect(within(menu).getByRole('link', { name: 'Add recipe' })).toBeInTheDocument();
      expect(document.body.style.overflow).toBe('hidden');

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(screen.queryByRole('dialog', { name: 'Menu' })).not.toBeInTheDocument();
      expect(burger).toHaveFocus();
      expect(document.body.style.overflow).toBe('');
    });

    it('closes with the close button and after navigation', async () => {
      const { router } = renderWithProviders({ user: mockAuthAccount });

      fireEvent.click(await screen.findByRole('button', { name: 'Open menu' }));
      fireEvent.click(screen.getByRole('button', { name: 'Close menu' }));
      expect(screen.queryByRole('dialog', { name: 'Menu' })).not.toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
      const menu = screen.getByRole('dialog', { name: 'Menu' });
      fireEvent.click(within(menu).getByRole('link', { name: 'Add recipe' }));

      expect(router.state.location.pathname).toBe('/recipe/add');
      expect(screen.queryByRole('dialog', { name: 'Menu' })).not.toBeInTheDocument();
    });
  });

  describe('Footer', () => {
    it('renders the logo, social links and copyright', () => {
      renderWithProviders();

      const footer = screen.getByRole('contentinfo');

      expect(within(footer).getByRole('link', { name: 'Foodies home' })).toHaveAttribute(
        'href',
        '/',
      );
      for (const network of ['Facebook', 'Instagram', 'YouTube']) {
        const link = within(footer).getByRole('link', { name: network });
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      }
      expect(within(footer).getByText(/Foodies\. All rights reserved/)).toBeInTheDocument();
    });
  });
});
