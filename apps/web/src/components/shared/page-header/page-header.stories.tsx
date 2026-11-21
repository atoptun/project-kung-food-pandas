import type { Meta, StoryObj } from '@storybook/react-vite';

import PageHeader from './page-header';

const meta = {
  title: 'Shared/UI/PageHeader',
  component: PageHeader,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    breadcrumbs: [{ to: '/', label: 'Home' }, { label: 'Profile' }],
    title: 'Profile',
    subtitle:
      'Reveal your culinary art, share your favorite recipe and create gastronomic masterpieces with us.',
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OnlyBreadcrumbs: Story = {
  args: {
    title: undefined,
    subtitle: undefined,
    breadcrumbs: [{ to: '/', label: 'Home' }, { label: 'Battenberg Cake' }],
  },
};

export const WithoutSubtitle: Story = {
  args: {
    breadcrumbs: [{ to: '/', label: 'Home' }, { label: 'Categories' }],
    title: 'Categories',
    subtitle: undefined,
  },
};

export const WithoutBreadcrumbs: Story = {
  args: {
    breadcrumbs: undefined,
    title: 'Add recipe',
    subtitle:
      'Reveal your culinary art, share your favorite recipe and create gastronomic masterpieces with us.',
  },
};
