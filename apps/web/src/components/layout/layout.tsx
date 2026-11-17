import { Suspense, useEffect } from 'react';
import { Outlet, useMatches } from 'react-router';

import AuthModal from '@/components/auth/auth-modal';
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
        <Suspense fallback={<p>Завантаження...</p>}>
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
