import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import CategoryList from './category-list';

const mockCategories = [
  {
    id: '1',
    name: 'Beef',
    image: 'https://res.cloudinary.com/lyycri5k/image/upload/v1794604016/kfp/categories/Beef.jpg',
  },
  {
    id: '2',
    name: 'Breakfast',
    image:
      'https://res.cloudinary.com/lyycri5k/image/upload/v1794604016/kfp/categories/Breakfast.jpg',
  },
  {
    id: '3',
    name: 'Chicken',
    image:
      'https://res.cloudinary.com/lyycri5k/image/upload/v1794604016/kfp/categories/Chicken.jpg',
  },
  {
    id: '4',
    name: 'Dessert',
    image:
      'https://res.cloudinary.com/lyycri5k/image/upload/v1794604016/kfp/categories/Desserts.jpg',
  },
  {
    id: '5',
    name: 'Goat',
    image: 'https://res.cloudinary.com/lyycri5k/image/upload/v1794604016/kfp/categories/Goat.jpg',
  },
  {
    id: '6',
    name: 'Lamb',
    image: 'https://res.cloudinary.com/lyycri5k/image/upload/v1794604016/kfp/categories/Lamb.jpg',
  },
  {
    id: '7',
    name: 'Miscellaneous',
    image:
      'https://res.cloudinary.com/lyycri5k/image/upload/v1794604016/kfp/categories/Miscellaneous.jpg',
  },
  {
    id: '8',
    name: 'Pasta',
    image: 'https://res.cloudinary.com/lyycri5k/image/upload/v1794604016/kfp/categories/Pasta.jpg',
  },
];

const meta = {
  title: 'Categories/CategoryList',
  component: CategoryList,
  parameters: {
    layout: 'padded',
  },
  args: {
    categories: mockCategories,
    onSelectCategory: fn(),
  },
} satisfies Meta<typeof CategoryList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FewItems: Story = {
  name: 'Few items',
  args: {
    categories: mockCategories.slice(0, 3),
  },
};
