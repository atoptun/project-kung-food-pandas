import * as stylex from '@stylexjs/stylex';

import { composition } from './hero-dishes.stylex';
import { heroImages } from './hero-images';

type HeroDishesProps = {
  xstyle?: stylex.StyleXStyles;
};

export function HeroDishes({ xstyle }: HeroDishesProps) {
  return (
    <div {...stylex.props(composition.wrapper, xstyle)} aria-hidden="true">
      <div {...stylex.props(composition.inner)}>
        {/* Small dish */}
        <picture {...stylex.props(composition.dishSmall)}>
          <source
            media="(min-width: 768px)"
            type="image/avif"
            srcSet={heroImages.image1.desktop.avif}
          />
          <source
            media="(min-width: 768px)"
            type="image/webp"
            srcSet={heroImages.image1.desktop.webp}
          />
          <source
            media="(min-width: 768px)"
            type="image/jpeg"
            srcSet={heroImages.image1.desktop.jpeg}
          />

          <source type="image/avif" srcSet={heroImages.image1.mobile.avif} />
          <source type="image/webp" srcSet={heroImages.image1.mobile.webp} />
          <source type="image/jpeg" srcSet={heroImages.image1.mobile.jpeg} />

          <img
            src={heroImages.image1.defaultSrc}
            alt=""
            loading="eager"
            decoding="async"
            {...stylex.props(composition.img)}
          />
        </picture>

        {/* Large dish  */}
        <picture {...stylex.props(composition.dishLarge)}>
          <source
            media="(min-width: 768px)"
            type="image/avif"
            srcSet={heroImages.image2.desktop.avif}
          />
          <source
            media="(min-width: 768px)"
            type="image/webp"
            srcSet={heroImages.image2.desktop.webp}
          />
          <source
            media="(min-width: 768px)"
            type="image/jpeg"
            srcSet={heroImages.image2.desktop.jpeg}
          />

          <source type="image/avif" srcSet={heroImages.image2.mobile.avif} />
          <source type="image/webp" srcSet={heroImages.image2.mobile.webp} />
          <source type="image/jpeg" srcSet={heroImages.image2.mobile.jpeg} />

          <img
            src={heroImages.image2.defaultSrc}
            alt=""
            loading="eager"
            decoding="async"
            {...stylex.props(composition.img)}
          />
        </picture>
      </div>
    </div>
  );
}

export default HeroDishes;
