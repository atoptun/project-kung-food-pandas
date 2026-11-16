import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { RecipeCard } from './recipe-card';

const meta = {
  title: 'Recipes/RecipeCard',
  component: RecipeCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: 343, margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    onToggleFavorite: fn(),
  },
} satisfies Meta<typeof RecipeCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'recipe-1',
    title: 'Delicious Lamb Chops with Mint Sauce',
    description:
      'A classic British cake made with almond sponge cake and covered with marzipan. It is traditionally pink and yellow checkered in appearance.',
    image: 'https://ftp.goit.study/img/so-yummy/preview/Battenberg%20Cake.jpg',
    author: {
      id: 'author-1',
      name: 'Larry Pageim',
      avatar:
        'https://res.cloudinary.com/lyycri5k/image/upload/v1794845261/kfp/avatars/avatar-test.png',
    },
    isFavorite: false,
    isFavoriteLoading: false,
  },
};

export const Favorite: Story = {
  args: {
    ...Default.args,
    id: 'recipe-fav',
    isFavorite: true,
  },
};

export const FavoriteLoading: Story = {
  args: {
    ...Default.args,
    id: 'recipe-fav-loading',
    isFavorite: true,
    isFavoriteLoading: true,
  },
};

export const LongContent: Story = {
  args: {
    id: 'recipe-long',
    title:
      'Ultra Super Extra Long Recipe Title That Might Break The Layout If Not Properly Handled By Truncation And Styles',
    description:
      'This is an exceptionally detailed and long recipe description intended to test multiple lines of text. It should cleanly clamp after two or three lines according to the specifications in the design system, ensuring that the card height remains balanced and clean across all screen sizes without overflowing into adjacent components.',
    image: 'https://ftp.goit.study/img/so-yummy/preview/Battenberg%20Cake.jpg',
    author: {
      id: 'author-long',
      name: 'Chef Maximiliano Constantine Ferdinand',
      avatar: null,
    },
    isFavorite: false,
  },
};

export const ExternalImage: Story = {
  args: {
    id: 'recipe-ext',
    title: 'Fresh Salmon Salad (Unsplash)',
    description:
      'Crisp mixed greens topped with oven-baked wild salmon fillets, sliced avocado, and lemon vinaigrette.',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    author: {
      id: 'author-2',
      name: 'Jamie Oliver',
      avatar: null,
    },
    isFavorite: false,
  },
};

export const MissingImage: Story = {
  args: {
    id: 'recipe-no-img',
    title: 'Secret Family Casserole',
    description: 'A comforting baked dish made with whatever is in the pantry.',
    image: null,
    author: {
      id: 'author-3',
      name: 'Grandma Mary',
      avatar: null,
    },
    isFavorite: false,
  },
};

export const BrokenImage: Story = {
  args: {
    id: 'recipe-broken',
    title: 'Broken Image URL Test',
    description: 'Shows fallback placeholder image when URL fails to load (404 error).',
    image: 'https://example.com/non-existent-image-404.jpg',
    author: {
      id: 'author-4',
      name: 'Tester',
      avatar: null,
    },
    isFavorite: false,
  },
};

export const Mobile320px: Story = {
  globals: { viewport: { value: 'mobileSmall', isRotated: false } },
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ width: 320, padding: 16 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    ...Default.args,
    id: 'recipe-mobile-320',
    title: 'Super Delicious Lamb Chops with Special Mint Sauce and Rosemary',
    description:
      'Testing 320px viewport width to ensure no horizontal overflow or scrollbars appear.',
    author: {
      id: 'author-long-name',
      name: 'Maximiliano Constantine Ferdinand',
      avatar: null,
    },
  },
};
