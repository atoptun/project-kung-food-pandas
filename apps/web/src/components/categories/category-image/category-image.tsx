import * as stylex from '@stylexjs/stylex';

import { buildCloudinaryUrl } from '@/utils/cloudinary';

import { styles } from './category-image.stylex';

interface CategoryImageProps {
  src: string;
  alt: string;
  xstyle?: stylex.StyleXStyles;
}

export function CategoryImage({ src, alt, xstyle }: CategoryImageProps) {
  const desk1x = buildCloudinaryUrl(src, { preset: 'categoryTablet', dpr: 1 });
  const desk2x = buildCloudinaryUrl(src, { preset: 'categoryTablet', dpr: 2 });

  const mob1x = buildCloudinaryUrl(src, { preset: 'categoryMobile', dpr: 1 });
  const mob2x = buildCloudinaryUrl(src, { preset: 'categoryMobile', dpr: 2 });

  return (
    <picture {...stylex.props(styles.picture, xstyle)}>
      {/* Desktop and Tablets */}
      <source media="(min-width: 768px)" srcSet={`${desk1x} 1x, ${desk2x} 2x`} />

      {/* Mobile */}
      <source srcSet={`${mob1x} 1x, ${mob2x} 2x`} />

      <img src={mob1x} alt={alt} loading="lazy" decoding="async" {...stylex.props(styles.img)} />
    </picture>
  );
}
