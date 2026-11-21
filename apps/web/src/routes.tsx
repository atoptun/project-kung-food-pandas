import { lazy } from 'react';
import type { RouteObject } from 'react-router';

import PrivateRoute from '@/components/auth/private-route';
import Layout from '@/components/layout/layout';

const HomePage = lazy(() => import('@/pages/home'));
const UserProfilePage = lazy(() => import('@/pages/user-profile'));
const RecipePage = lazy(() => import('@/pages/recipe'));
const RecipeAddPage = lazy(() => import('@/pages/recipe-add'));
const NotFoundPage = lazy(() => import('@/pages/not-found'));

export interface RouteHandle {
  title: string;
  crumb?: string;
  /** `dark` renders the header on the dark hero card (home page). */
  headerTheme?: 'light' | 'dark';
}

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
        handle: { title: 'Home', headerTheme: 'dark' } satisfies RouteHandle,
      },
      {
        path: '/recipe/add',
        element: (
          <PrivateRoute>
            <RecipeAddPage />
          </PrivateRoute>
        ),
        handle: { title: 'Recipe Add', crumb: 'Add recipe' } satisfies RouteHandle,
      },
      {
        path: '/recipe/:id',
        element: <RecipePage />,
        handle: { title: 'Recipe', crumb: 'Recipe' } satisfies RouteHandle,
      },
      {
        path: '/user/:id/:tab?',
        element: (
          <PrivateRoute>
            <UserProfilePage />
          </PrivateRoute>
        ),
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
