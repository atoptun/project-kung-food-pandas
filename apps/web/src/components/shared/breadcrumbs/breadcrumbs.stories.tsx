import type { Meta, StoryObj } from '@storybook/react-vite';

import Breadcrumbs from './breadcrumbs';

const meta = {
  title: 'Shared/UI/breadcrumbs',
  component: Breadcrumbs,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    items: [{ to: '/', label: 'Home' }, { to: '/users', label: 'Users' }, { label: 'Profile' }],
  },
} satisfies Story;
