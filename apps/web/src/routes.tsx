import { lazy } from 'react';
import type { RouteObject } from 'react-router';

import Layout from '@/components/layout/layout';

const HomePage = lazy(() => import('@/pages/home'));
const UserProfilePage = lazy(() => import('@/pages/user-profile'));
const RecipePage = lazy(() => import('@/pages/recipe'));
const RecipeAddPage = lazy(() => import('@/pages/recipe-add'));
const NotFoundPage = lazy(() => import('@/pages/not-found'));

export interface RouteHandle {
  title: string;
  crumb?: string;
}

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
        handle: { title: 'Home' } satisfies RouteHandle,
      },
      {
        path: '/recipe/add',
        element: <RecipeAddPage />,
        handle: { title: 'Recipe Add', crumb: 'Add recipe' } satisfies RouteHandle,
      },
      {
        path: '/recipe/:id',
        element: <RecipePage />,
        handle: { title: 'Recipe', crumb: 'Recipe' } satisfies RouteHandle,
      },
      {
        path: '/user/:id',
        element: <UserProfilePage />,
        handle: { title: 'User Profile', crumb: 'User profile' } satisfies RouteHandle,
      },
      {
        path: '*',
        element: <NotFoundPage />,
        handle: { title: 'Not Found' } satisfies RouteHandle,
      },
    ],
  },
];
