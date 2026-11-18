import * as stylex from '@stylexjs/stylex';

import Button from '@/components/shared/button/button';
import Section from '@/components/shared/section/section';
import { typography } from '@/styles/typography.stylex';

import { hero } from './hero.stylex';
import HeroDishes from './hero-dishes';

type HeroProps = {
  xstyle?: stylex.StyleXStyles;
};

export function Hero({ xstyle }: HeroProps) {
  return (
    <Section withContainer aria-label="Hero" xstyle={[hero.card, xstyle]}>
      <div {...stylex.props(hero.content)}>
        <h1 {...stylex.props(typography.h1, hero.title)}>Improve Your Culinary Skills</h1>
        <p {...stylex.props(typography.main, hero.description)}>
          Dive into a world of delicious recipes and discover the art of cooking with our diverse
          collection of culinary delights.
        </p>
        <Button to="/recipe/add" variant="inverse" xstyle={hero.button}>
          Add recipe
        </Button>

        <HeroDishes />
      </div>
    </Section>
  );
}

export default Hero;
