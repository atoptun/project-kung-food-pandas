import * as stylex from '@stylexjs/stylex';
import { useNavigate } from 'react-router';

import wellingtonUrl from '@/assets/hero/beef-wellington.png';
import dessertUrl from '@/assets/hero/dessert.png';
import Button from '@/components/shared/button/button';
import { useAuth } from '@/hooks/use-auth';
import { useAuthModalStore } from '@/stores/auth-modal.store';
import { typography } from '@/styles/typography.stylex';

import { styles } from './home.stylex';

export default function Hero() {
  const { isAuthenticated, isPending } = useAuth();
  const openSignIn = useAuthModalStore((state) => state.openSignIn);
  const navigate = useNavigate();

  return (
    <section aria-labelledby="hero-title" {...stylex.props(styles.hero)}>
      <h1 id="hero-title" {...stylex.props(typography.h1, styles.heroTitle)}>
        Improve your culinary talents
      </h1>
      <p {...stylex.props(typography.main, styles.heroSubtitle)}>
        Amazing recipes for beginners in the world of cooking, enveloping you in the aromas and
        tastes of various cuisines.
      </p>
      <Button
        variant="inverse"
        xstyle={styles.heroAction}
        disabled={isPending}
        onClick={() => (isAuthenticated ? void navigate('/recipe/add') : openSignIn())}
      >
        Add recipe
      </Button>
      <div aria-hidden="true" {...stylex.props(styles.heroImages)}>
        <img
          src={dessertUrl}
          alt=""
          width={296}
          height={277}
          decoding="async"
          {...stylex.props(styles.heroDessert)}
        />
        <img
          src={wellingtonUrl}
          alt=""
          width={705}
          height={660}
          decoding="async"
          fetchPriority="high"
          {...stylex.props(styles.heroWellington)}
        />
      </div>
    </section>
  );
}
