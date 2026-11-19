import type { Meta, StoryObj } from '@storybook/react-vite';
import { http, HttpResponse } from 'msw';

import Testimonials from './testimonials';

const mockTestimonials = [
  {
    id: 't-1',
    testimonial:
      'Foodies has completely transformed how I cook at home. The recipes are easy to follow and the ingredient lists are always accurate!',
    owner: { id: 'u-1', name: 'Sarah Jenkins', avatar: null },
  },
  {
    id: 't-2',
    testimonial:
      'I love the detailed cooking instructions and community vibe. Finding inspiration for dinner has never been this simple.',
    owner: { id: 'u-2', name: 'Marco Rossi', avatar: null },
  },
  {
    id: 't-3',
    testimonial:
      'The search and category filters are super fast. I can quickly discover desserts or pasta dishes with whatever is in my fridge.',
    owner: { id: 'u-3', name: 'Olena Kovalenko', avatar: null },
  },
];

const meta = {
  title: 'Home/Testimonials',
  component: Testimonials,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    intervalMs: 3000,
  },
} satisfies Meta<typeof Testimonials>;

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
        http.get('*/testimonials', async () => {
          await new Promise(() => {}); // never resolves
        }),
      ],
    },
  },
};

export const CustomList: Story = {
  name: 'Custom Testimonials (3s Auto-play)',
  parameters: {
    msw: {
      handlers: [
        http.get('*/testimonials', () => {
          return HttpResponse.json({
            items: mockTestimonials,
            total: mockTestimonials.length,
          });
        }),
      ],
    },
  },
};
