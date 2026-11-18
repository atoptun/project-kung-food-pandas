import { Suspense, useEffect } from 'react';
import { Outlet, useMatches } from 'react-router';

import AuthModal from '@/components/auth/auth-modal';
import Loader from '@/components/shared/loader/loader';
import Toaster from '@/components/shared/toaster/toaster';
import type { RouteHandle } from '@/routes';

import Footer from './footer';
import Header from './header';

function Layout() {
  const matches = useMatches();
  const handle = matches.at(-1)?.handle as RouteHandle | undefined;

  useEffect(() => {
    document.title = `${handle?.title ?? 'Not Found'} | Foodies`;
  }, [handle]);

  return (
    <>
      <Header theme={handle?.headerTheme} />
      <main>
        <Suspense fallback={<Loader size="lg" fullscreen label="Loading page..." />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <AuthModal />
      <Toaster />
    </>
  );
}

export default Layout;
