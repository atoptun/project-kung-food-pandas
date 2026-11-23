import { Suspense } from 'react';
import { Outlet, ScrollRestoration, useMatches } from 'react-router';

import AuthModal from '@/components/auth/auth-modal';
import RecipesSessionSync from '@/components/recipes/recipes-session-sync';
import Loader from '@/components/shared/loader/loader';
import PageMeta from '@/components/shared/page-meta/page-meta';
import Toaster from '@/components/shared/toaster/toaster';
import type { RouteHandle } from '@/routes';

import Footer from './footer';
import Header from './header';

function Layout() {
  const matches = useMatches();
  const handle = matches.at(-1)?.handle as RouteHandle | undefined;

  return (
    <>
      <PageMeta title={handle?.title ?? 'Not Found'} />
      <ScrollRestoration />
      <Header theme={handle?.headerTheme} />
      <main>
        <Suspense fallback={<Loader size="lg" fullscreen label="Loading page..." />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <AuthModal />
      <RecipesSessionSync />
      <Toaster />
    </>
  );
}

export default Layout;
