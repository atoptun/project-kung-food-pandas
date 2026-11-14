import { Suspense } from 'react';
import { Outlet } from 'react-router';

import Footer from './footer';
import Header from './header';

function Layout() {
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
