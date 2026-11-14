import * as stylex from '@stylexjs/stylex';

import { styles } from './category-image.stylex';

function buildCloudinaryUrl(
  url: string,
  { w, h, dpr = 1 }: { w: number; h: number; dpr?: number },
) {
  if (!url || !url.includes('cloudinary.com')) return url;

  // c_fill - заповнює розмір, g_auto - фокусується на головному об'єкті страви
  const transform = `f_auto,q_auto,c_fill,g_auto,w_${w},h_${h},dpr_${dpr.toFixed(1)}`;
  return url.replace('/upload/', `/upload/${transform}/`);
}

interface CategoryImageProps {
  src: string;
  alt: string;
  xstyle?: stylex.StyleXStyles;
}

export function CategoryImage({ src, alt, xstyle }: CategoryImageProps) {
  const desk1x = buildCloudinaryUrl(src, { w: 704, h: 369, dpr: 1 });
  const desk2x = buildCloudinaryUrl(src, { w: 704, h: 369, dpr: 2 });

  const mob1x = buildCloudinaryUrl(src, { w: 375, h: 250, dpr: 1 });
  const mob2x = buildCloudinaryUrl(src, { w: 375, h: 250, dpr: 2 });

  return (
    <picture {...stylex.props(styles.picture, xstyle)}>
      {/* Desktop and Tablets */}
      <source media="(min-width: 768px)" srcSet={`${desk1x} 1x, ${desk2x} 2x`} />

      {/* Mobile */}
      <source srcSet={`${mob1x} 1x, ${mob2x} 2x`} />

      <img src={desk1x} alt={alt} loading="lazy" decoding="async" {...stylex.props(styles.img)} />
    </picture>
  );
}
