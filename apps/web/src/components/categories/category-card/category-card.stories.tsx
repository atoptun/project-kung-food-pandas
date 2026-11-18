import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import CategoryCard from './category-card';

const meta = {
  title: 'Categories/CategoryCard',
  component: CategoryCard,
  parameters: {
    layout: 'centered',
  },
  args: {
    onSelect: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ width: 343, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CategoryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: '6462a6cd4c3d0ddd28897f8f',
    name: 'Dessert',
    image:
      'https://res.cloudinary.com/lyycri5k/image/upload/v1794604016/kfp/categories/Desserts.jpg',
  },
};

export const AllCategories: Story = {
  name: 'All Categories Card',
  args: {
    id: null,
    name: 'All categories',
    image: null,
  },
};

export const WithoutImageFallback: Story = {
  name: 'Without Image (Placeholder)',
  args: {
    id: 'category-without-image',
    name: 'Vegetarian',
    image: null,
  },
};
