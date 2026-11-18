import type { Meta, StoryObj } from '@storybook/react-vite';

import Loader from './loader';

const meta = {
  title: 'Shared/Loader',
  component: Loader,
  parameters: {
    layout: 'centered',
  },
  args: {
    label: 'Loading...',
    size: 'md',
    color: 'dark',
  },
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const LightOnDarkBackground: Story = {
  name: 'Light Color (on Dark)',
  args: {
    color: 'light',
    size: 'md',
  },
  decorators: [
    (Story) => (
      <div style={{ backgroundColor: '#050505', padding: 40, borderRadius: 16 }}>
        <Story />
      </div>
    ),
  ],
};
