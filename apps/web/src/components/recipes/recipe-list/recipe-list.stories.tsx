import type { Meta, StoryObj } from '@storybook/react-vite';

import type { RecipeCard as RecipeCardData } from '@/api/recipes/recipes.types';

import { RecipeList } from './recipe-list';

const mockRecipes: RecipeCardData[] = [
  {
    id: '1',
    title: 'Delicious Lamb Chops with Mint Sauce',
    description: 'Tender lamb chops with a fragrant fresh mint and herb sauce.',
    thumb: 'https://ftp.goit.study/img/so-yummy/preview/Battenberg%20Cake.jpg',
    time: 45,
    favoritesCount: 15,
    isFavorite: false,
    owner: { id: 'u1', name: 'Gordon Ramsay', avatar: null },
  },
  {
    id: '2',
    title: 'Classic Italian Beef Bolognese Pasta',
    description: 'Slow-cooked rich beef ragu tossed with fresh tagliatelle.',
    thumb: null,
    time: 90,
    favoritesCount: 42,
    isFavorite: true,
    owner: { id: 'u2', name: 'Jamie Oliver', avatar: null },
  },
  {
    id: '3',
    title: 'Creamy Mushroom and Herb Risotto',
    description: 'Arborio rice with wild forest mushrooms and aged parmesan.',
    thumb: 'https://ftp.goit.study/img/so-yummy/preview/Battenberg%20Cake.jpg',
    time: 35,
    favoritesCount: 8,
    isFavorite: false,
    owner: { id: 'u3', name: 'Victoria', avatar: null },
  },
  {
    id: '4',
    title: 'Grilled Salmon with Asparagus',
    description: 'Fresh Atlantic salmon fillet with lemon butter and grilled greens.',
    thumb: 'https://ftp.goit.study/img/so-yummy/preview/Battenberg%20Cake.jpg',
    time: 25,
    favoritesCount: 30,
    isFavorite: false,
    owner: { id: 'u4', name: 'Marcus Wareing', avatar: null },
  },
  {
    id: '5',
    title: 'Traditional Shakshuka with Poached Eggs',
    description: 'Spiced tomato and bell pepper sauce topped with runny organic eggs.',
    thumb: null,
    time: 30,
    favoritesCount: 19,
    isFavorite: false,
    owner: { id: 'u5', name: 'Yotam Ottolenghi', avatar: null },
  },
  {
    id: '6',
    title: 'Authentic Thai Green Curry',
    description: 'Fragrant coconut curry with lemongrass, ginger, and fresh basil.',
    thumb: 'https://ftp.goit.study/img/so-yummy/preview/Battenberg%20Cake.jpg',
    time: 40,
    favoritesCount: 55,
    isFavorite: true,
    owner: { id: 'u6', name: 'David Thompson', avatar: null },
  },
];

const meta = {
  title: 'Recipes/RecipeList',
  component: RecipeList,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    recipes: mockRecipes,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RecipeList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default (6 Recipes)',
  args: {
    recipes: mockRecipes,
  },
};

export const SingleRecipe: Story = {
  name: 'Single Recipe',
  args: {
    recipes: mockRecipes.slice(0, 1),
  },
};

export const Empty: Story = {
  name: 'Empty List',
  args: {
    recipes: [],
  },
};
