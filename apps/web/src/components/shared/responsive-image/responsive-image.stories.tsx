import type { Meta, StoryObj } from '@storybook/react-vite';

import { ResponsiveImage } from './responsive-image';

const meta = {
  title: 'Shared/UI/ResponsiveImage',
  component: ResponsiveImage,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: 343, height: 250 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ResponsiveImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CloudinaryImage: Story = {
  args: {
    src: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
    alt: 'Sample dish',
    preset: {
      mobile: 'recipeCardMobile',
      desktop: 'recipeCard',
    },
    placeholderSize: 64,
  },
};

export const ExternalUrl: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    alt: 'Fresh salad',
    preset: {
      mobile: 'recipeCardMobile',
      desktop: 'recipeCard',
    },
    placeholderSize: 64,
  },
};

export const MissingImagePlaceholder: Story = {
  args: {
    src: null,
    alt: 'No image provided',
    preset: {
      mobile: 'recipeCardMobile',
      desktop: 'recipeCard',
    },
    placeholderSize: 64,
  },
};

export const BrokenImageFallback: Story = {
  args: {
    src: 'https://example.com/non-existent-image-404.jpg',
    alt: 'Broken link',
    preset: {
      mobile: 'recipeCardMobile',
      desktop: 'recipeCard',
    },
    placeholderSize: 64,
  },
};
