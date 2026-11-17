import * as stylex from '@stylexjs/stylex';
import { useNavigate } from 'react-router';

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
        disabled={isPending}
        onClick={() => (isAuthenticated ? void navigate('/recipe/add') : openSignIn())}
      >
        Add recipe
      </Button>
      {/* Original Hero photos still require an asset export; keep their measured space. */}
      <div aria-hidden="true" {...stylex.props(styles.heroImages)} />
    </section>
  );
}
