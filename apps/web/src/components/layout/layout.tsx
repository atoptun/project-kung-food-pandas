import { Suspense, useEffect } from 'react';
import { Outlet, useMatches } from 'react-router';

import type { RouteHandle } from '@/routes';

import Footer from './footer';
import Header from './header';

function Layout() {
  const matches = useMatches();

  useEffect(() => {
    const currentMatch = matches.at(-1);
    const handle = currentMatch?.handle as RouteHandle | undefined;

    document.title = `${handle?.title ?? 'Not Found'} | Foodies`;
  }, [matches]);

  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<p>Завантаження...</p>}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

export default Layout;
