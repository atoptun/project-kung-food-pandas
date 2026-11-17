import type { Meta, StoryObj } from '@storybook/react-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

import { queryKeys } from '@/api/keys';
import AuthModal from '@/components/auth/auth-modal';
import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';
import Toaster from '@/components/shared/toaster/toaster';
import areas from '@/mocks/data/areas.json';
import categories from '@/mocks/data/categories.json';
import ingredients from '@/mocks/data/ingredients.json';
import recipes from '@/mocks/data/recipes.json';
import testimonials from '@/mocks/data/testimonials.json';
import HomePage from '@/pages/home';

function HomePreview() {
  const [client] = useState(() => {
    const cache = new QueryClient({
      defaultOptions: { queries: { staleTime: Infinity, retry: false } },
    });
    cache.setQueryData(queryKeys.categories.all, categories);
    cache.setQueryData(queryKeys.areas.all, areas);
    cache.setQueryData(queryKeys.ingredients.all, ingredients);
    cache.setQueryData(queryKeys.testimonials.all, {
      items: testimonials,
      total: testimonials.length,
      page: 1,
      limit: 10,
      totalPages: 1,
    });
    for (const category of [undefined, ...categories.map((item) => item.id)]) {
      const items = recipes.filter((item) => !category || item.category.id === category);
      cache.setQueryData(
        queryKeys.recipes.list({ page: 1, limit: 12, ...(category && { category }) }),
        {
          items,
          total: items.length,
          page: 1,
          limit: 12,
          totalPages: Math.ceil(items.length / 12),
        },
      );
    }
    return cache;
  });
  return (
    <QueryClientProvider client={client}>
      <Header theme="dark" />
      <main>
        <HomePage />
      </main>
      <Footer />
      <AuthModal />
      <Toaster />
    </QueryClientProvider>
  );
}

const meta = {
  title: 'Home/Home and catalog',
  component: HomePage,
  parameters: { layout: 'fullscreen' },
  render: () => <HomePreview />,
} satisfies Meta<typeof HomePage>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Mobile: Story = { globals: { viewport: { value: 'mobile', isRotated: false } } };
export const Tablet: Story = { globals: { viewport: { value: 'tablet', isRotated: false } } };
export const Desktop: Story = { globals: { viewport: { value: 'desktop', isRotated: false } } };
