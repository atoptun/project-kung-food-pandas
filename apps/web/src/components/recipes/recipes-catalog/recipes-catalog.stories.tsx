import type { Meta, StoryObj } from '@storybook/react-vite';
import { http, HttpResponse } from 'msw';
import { fn } from 'storybook/test';

import RecipesCatalog from './recipes-catalog';

const meta = {
  title: 'Recipes/RecipesCatalog',
  component: RecipesCatalog,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    category: {
      id: '6462a6cd4c3d0ddd28897f8f',
      name: 'Dessert',
    },
    onBack: fn(),
  },
} satisfies Meta<typeof RecipesCatalog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default (Specific Category)',
  args: {
    category: {
      id: '6462a6cd4c3d0ddd28897f8f',
      name: 'Dessert',
    },
  },
};

export const AllCategories: Story = {
  name: 'All Categories Selected',
  args: {
    category: {
      id: null,
      name: 'All categories',
    },
  },
};

export const LoadingState: Story = {
  name: 'Loading State',
  parameters: {
    msw: {
      handlers: [
        http.get('*/recipes', async () => {
          await new Promise(() => {}); // never resolves
        }),
      ],
    },
  },
};

export const EmptyState: Story = {
  name: 'Empty State (No recipes found)',
  parameters: {
    msw: {
      handlers: [
        http.get('*/recipes', () => {
          return HttpResponse.json({
            items: [],
            total: 0,
            page: 1,
            limit: 12,
            totalPages: 0,
          });
        }),
      ],
    },
  },
};

export const ErrorState: Story = {
  name: 'Error State (Server 500)',
  parameters: {
    msw: {
      handlers: [
        http.get('*/recipes', () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
};
