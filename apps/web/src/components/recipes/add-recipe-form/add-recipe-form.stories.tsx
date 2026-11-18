import type { Meta, StoryObj } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

import { queryKeys } from '@/api/keys';
import photoUrl from '@/assets/categories/seafood@2x.jpg';
import Container from '@/components/shared/container/container';
import areas from '@/mocks/data/areas.json';
import categories from '@/mocks/data/categories.json';
import ingredients from '@/mocks/data/ingredients.json';

import { initialRecipeValues, type RecipeFormValues } from './add-recipe.validation';
import AddRecipeForm from './add-recipe-form';

function StoryForm({ initialValues }: { initialValues?: RecipeFormValues }) {
  const [client] = useState(() => {
    const cache = new QueryClient();
    cache.setQueryData(queryKeys.dictionaries.categories(), categories);
    cache.setQueryData(queryKeys.dictionaries.areas(), areas);
    cache.setQueryData(queryKeys.dictionaries.ingredients(), ingredients);
    return cache;
  });
  return (
    <QueryClientProvider client={client}>
      <Container>
        <AddRecipeForm initialValues={initialValues} />
      </Container>
    </QueryClientProvider>
  );
}

const meta = {
  title: 'Recipes/Add recipe',
  component: AddRecipeForm,
  parameters: { layout: 'fullscreen' },
  render: () => <StoryForm />,
} satisfies Meta<typeof AddRecipeForm>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const Filled: Story = {
  loaders: [
    async () => {
      const response = await fetch(photoUrl);
      if (!response.ok) throw new Error('Unable to load the local recipe photo');
      return { photo: new File([await response.blob()], 'seafood.jpg', { type: 'image/jpeg' }) };
    },
  ],
  render: (_args, { loaded }) => (
    <StoryForm
      initialValues={{
        ...initialRecipeValues,
        title: 'Salmon avocado salad',
        description: 'A healthy salad with salmon, avocado and fresh herbs.',
        instructions:
          'Slice the vegetables and combine with salmon. Mix olive oil and lemon juice, season and serve immediately.',
        categoryId: '6462a6cd4c3d0ddd28897f8a',
        areaId: '6462a6f04c3d0ddd28897f9b',
        time: 40,
        ingredients: [
          { id: '640c2dd963a319ea671e365c', measure: '400 g' },
          { id: '640c2dd963a319ea671e365f', measure: '2 tbsp' },
        ],
        photo: loaded.photo as File,
      }}
    />
  ),
};

export const FilledMobile: Story = {
  ...Filled,
  name: 'Filled Mobile / 375px',
  globals: {
    viewport: { value: 'mobile', isRotated: false },
  },
};

export const FilledTablet: Story = {
  ...Filled,
  name: 'Filled Tablet / 768px',
  globals: {
    viewport: { value: 'tablet', isRotated: false },
  },
};

export const FilledDesktop: Story = {
  ...Filled,
  name: 'Filled Desktop / 1440px',
  globals: {
    viewport: { value: 'desktop', isRotated: false },
  },
};
