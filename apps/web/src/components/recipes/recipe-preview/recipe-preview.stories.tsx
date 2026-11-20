import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import RecipePreview from './recipe-preview';

const meta = {
  title: 'Recipes/RecipePreview',
  component: RecipePreview,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 846 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    recipe: {
      id: 'recipe-1',
      title: 'Bakewell tart',
      description:
        'A British dessert consisting of a shortcrust pastry shell with jam, frangipane and almonds.',
      thumb: 'https://ftp.goit.study/img/so-yummy/preview/Bakewell%20tart.jpg',
    },
    onRemove: fn(),
    removeLabel: 'Delete recipe: Bakewell tart',
  },
} satisfies Meta<typeof RecipePreview>;
export default meta;
type Story = StoryObj<typeof meta>;
export const OwnRecipe: Story = {};
export const OtherRecipe: Story = { args: { onRemove: undefined } };
export const Removing: Story = { args: { isPending: true } };
