import type { Meta, StoryObj } from '@storybook/react-vite';

import HomeView from './home-view';

const meta = {
  title: 'Home/HomeView',
  component: HomeView,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof HomeView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default (Categories View)',
};

export const CatalogView: Story = {
  name: 'With Selected Category (Catalog View)',
  args: {
    initialCategory: {
      id: '6462a6cd4c3d0ddd28897f8f',
      name: 'Dessert',
    },
  },
};

export const AllCategoriesView: Story = {
  name: 'With All Categories Selected',
  args: {
    initialCategory: {
      id: null,
      name: 'All categories',
    },
  },
};
