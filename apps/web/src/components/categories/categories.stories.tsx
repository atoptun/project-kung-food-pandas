import type { Meta, StoryObj } from '@storybook/react-vite';
import { http, HttpResponse } from 'msw';
import { fn } from 'storybook/test';

import Categories from './categories';

const meta = {
  title: 'Categories/Categories',
  component: Categories,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    onSelectCategory: fn(),
  },
} satisfies Meta<typeof Categories>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default (Data from MSW)',
};

export const LoadingState: Story = {
  name: 'Loading State',
  parameters: {
    msw: {
      handlers: [
        http.get('*/categories', async () => {
          await new Promise(() => {}); // never resolves
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
        http.get('*/categories', () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
};
