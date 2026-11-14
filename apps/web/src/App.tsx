import { lazy } from 'react';

const HomePage = lazy(() => import('@/pages/home'));
const UserProfilePage = lazy(() => import('@/pages/user-profile'));
const RecipePage = lazy(() => import('@/pages/recipe'));
const RecipeAddPage = lazy(() => import('@/pages/recipe-add'));
const NotFoundPage = lazy(() => import('@/pages/not-found'));

import { Route, Routes } from 'react-router';

import Layout from '@/components/layout/layout';

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/user/:id" element={<UserProfilePage />} />
        <Route path="/recipe/:id" element={<RecipePage />} />
        <Route path="/recipe/add" element={<RecipeAddPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
