import type { Meta, StoryObj } from '@storybook/react-vite';

import AuthorButton from './author-button';

const meta = {
  title: 'Recipes/author-button',
  component: AuthorButton,
  parameters: {
    layout: 'centered',
  },
  args: {
    author: {
      id: 'mock-user-1',
      name: 'Victoria',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
  },
} satisfies Meta<typeof AuthorButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    withLabel: false,
  },
};

export const WithCreatedByLabel: Story = {
  args: {
    withLabel: true,
  },
};
