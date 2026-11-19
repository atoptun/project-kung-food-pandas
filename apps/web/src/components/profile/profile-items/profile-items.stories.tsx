import type { UserFollowersListResponse, UserRecipesListResponse } from '@repo/shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { http, HttpResponse } from 'msw';
import { fn } from 'storybook/test';

import Container from '@/components/shared/container/container';
import { clientEnv } from '@/env';
import { mockRecipesList } from '@/mocks/handlers/recipes';

import { PROFILE_PAGE_SIZES } from '../profile.constants';
import ProfileItems from './profile-items';

const recipes = [
  ...mockRecipesList
    .slice(0, PROFILE_PAGE_SIZES.recipes - 1)
    .map(({ id, title, description }) => ({ id, title, description })),
  {
    id: 'roast-carrot-soup',
    title: 'Roast carrot soup',
    description: 'Roasted carrots blended with ginger and vegetable stock.',
  },
  {
    id: 'lemon-yogurt-cake',
    title: 'Lemon yogurt cake',
    description: 'A simple yogurt cake with lemon zest and a crisp sugar topping.',
  },
];

const following: UserFollowersListResponse = {
  items: [
    {
      user: { id: 'olivia', name: 'Olivia Brooks' },
      recipesCount: 12,
      topRecipes: recipes.slice(0, 4),
    },
    { user: { id: 'maya', name: 'Maya Quinn' }, recipesCount: 8, topRecipes: recipes.slice(4, 7) },
  ],
  page: 1,
  limit: PROFILE_PAGE_SIZES.following,
  total: 2,
  totalPages: 1,
};

const meta = {
  title: 'Profile/ProfileItems',
  component: ProfileItems,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <Container>
        <div style={{ maxWidth: 846, marginInline: 'auto' }}>
          <Story />
        </div>
      </Container>
    ),
  ],
  args: {
    id: 'victoria',
    viewerId: 'victoria',
    tab: 'recipes',
    follows: {
      getStatus: () => undefined,
      isPending: () => false,
      toggle: fn(),
      isError: false,
      isFetching: false,
      retry: fn(),
    },
  },
} satisfies Meta<typeof ProfileItems>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Recipes: Story = {
  args: { id: 'olivia' },
  parameters: {
    msw: {
      handlers: [
        http.get(`${clientEnv.VITE_API_URL}/users/olivia/recipes`, ({ request }) => {
          const page = Number(new URL(request.url).searchParams.get('page') ?? 1);
          const limit = PROFILE_PAGE_SIZES.recipes;
          return HttpResponse.json<UserRecipesListResponse>({
            items: recipes.slice((page - 1) * limit, page * limit),
            page,
            limit,
            total: recipes.length,
            totalPages: Math.ceil(recipes.length / limit),
          });
        }),
      ],
    },
  },
};

export const Following: Story = {
  args: { tab: 'following' },
  parameters: {
    msw: {
      handlers: [
        http.get(`${clientEnv.VITE_API_URL}/users/me/following`, () =>
          HttpResponse.json(following),
        ),
      ],
    },
  },
};

export const EmptyFavorites: Story = {
  args: { tab: 'favorites' },
  parameters: {
    msw: {
      handlers: [
        http.get(`${clientEnv.VITE_API_URL}/recipes/favorites`, () =>
          HttpResponse.json({
            items: [],
            page: 1,
            limit: PROFILE_PAGE_SIZES.favorites,
            total: 0,
            totalPages: 0,
          }),
        ),
      ],
    },
  },
};
