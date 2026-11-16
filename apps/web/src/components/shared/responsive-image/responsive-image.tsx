import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';

import Icon from '@/components/shared/icon/icon';
import { buildCloudinaryUrl, type ImagePreset, isCloudinaryUrl } from '@/utils/cloudinary';

import { styles } from './responsive-image.stylex';

export interface ResponsiveImagePresetConfig {
  mobile?: ImagePreset;
  desktop: ImagePreset;
}

export interface ResponsiveImageProps {
  src?: string | null;
  alt?: string;
  preset: ResponsiveImagePresetConfig;
  placeholderSize?: number;
  wrapperXstyle?: stylex.StyleXStyles;
  imgXstyle?: stylex.StyleXStyles;
  placeholderXstyle?: stylex.StyleXStyles;
}

export function ResponsiveImage({
  src,
  alt,
  preset,
  placeholderSize = 64,
  wrapperXstyle,
  imgXstyle,
  placeholderXstyle,
}: ResponsiveImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const mobPreset = preset.mobile ?? preset.desktop;
  const deskPreset = preset.desktop;

  const isCloudinary = isCloudinaryUrl(src);

  const mob1x = buildCloudinaryUrl(src, { preset: mobPreset, dpr: 1 });
  const mob2x = buildCloudinaryUrl(src, { preset: mobPreset, dpr: 2 });
  const desk1x = buildCloudinaryUrl(src, { preset: deskPreset, dpr: 1 });
  const desk2x = buildCloudinaryUrl(src, { preset: deskPreset, dpr: 2 });

  const hasError = Boolean(src && src === failedSrc);

  return (
    <div {...stylex.props(styles.wrapper, wrapperXstyle)}>
      {hasError || !src ? (
        <Icon
          name="no-image"
          size={placeholderSize}
          xstyle={[styles.placeholderIcon, placeholderXstyle]}
        />
      ) : isCloudinary ? (
        <picture {...stylex.props(styles.picture)}>
          <source media="(min-width: 768px)" srcSet={`${desk1x} 1x, ${desk2x} 2x`} />
          <source srcSet={`${mob1x} 1x, ${mob2x} 2x`} />
          <img
            {...stylex.props(styles.img, imgXstyle)}
            src={mob1x}
            alt={alt}
            loading="lazy"
            decoding="async"
            onError={() => {
              if (src) setFailedSrc(src);
            }}
          />
        </picture>
      ) : (
        <img
          {...stylex.props(styles.img, imgXstyle)}
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => {
            if (src) setFailedSrc(src);
          }}
        />
      )}
    </div>
  );
}

export default ResponsiveImage;
