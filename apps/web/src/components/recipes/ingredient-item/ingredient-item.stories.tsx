import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { IngredientItem } from './ingredient-item';

const meta = {
  title: 'Recipes/IngredientItem',
  component: IngredientItem,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: 343, margin: '0 auto', boxSizing: 'border-box' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    onRemove: fn(),
  },
} satisfies Meta<typeof IngredientItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'ing-1',
    name: 'Olive oil',
    measure: '3 tbs',
    image: 'https://ftp.goit.study/img/so-yummy/ingredients/640c2dd963a319ea671e372c.png',
    onRemove: undefined,
  },
};

export const WithRemove: Story = {
  args: {
    id: 'ing-2',
    name: 'Avocado',
    measure: '3',
    image: 'https://ftp.goit.study/img/so-yummy/ingredients/640c2dd963a319ea671e365f.png',
  },
};

export const RemovingState: Story = {
  args: {
    id: 'ing-3',
    name: 'Avocado',
    measure: '3',
    image: 'https://ftp.goit.study/img/so-yummy/ingredients/640c2dd963a319ea671e365f.png',
  },
};

export const ExternalImage: Story = {
  args: {
    id: 'ing-ext',
    name: 'Olive oil (External URL)',
    measure: '3 tbs',
    image:
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=300&q=80',
    onRemove: undefined,
  },
};

export const MissingImage: Story = {
  args: {
    id: 'ing-missing',
    name: 'Sea Salt',
    measure: '1 pinch',
    image: null,
    onRemove: undefined,
  },
};

export const BrokenImage: Story = {
  args: {
    id: 'ing-broken',
    name: 'Black Pepper',
    measure: '1/2 tsp',
    image: 'https://example.com/broken-spice-image.jpg',
  },
};

export const LongText: Story = {
  args: {
    id: 'ing-long',
    name: 'Extra Virgin Cold Pressed Organic Mediterranean Olive Oil',
    measure: 'Approximately 250 milliliters or to taste depending on preference',
    image: 'https://ftp.goit.study/img/so-yummy/ingredients/640c2dd963a319ea671e372c.png',
  },
};
