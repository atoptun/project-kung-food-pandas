import { useEffect } from 'react';

import HomeView from '@/components/home/home-view';
import { useAuthModalStore } from '@/stores/auth-modal.store';

function HomePage() {
  const finishLogout = useAuthModalStore((state) => state.finishLogout);

  useEffect(() => {
    finishLogout();
  }, [finishLogout]);
  return <HomeView />;
}

export default HomePage;
