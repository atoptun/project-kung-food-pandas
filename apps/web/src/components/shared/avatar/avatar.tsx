import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';

import noImage from '@/assets/no-image.png';

import { size, styles } from './avatar.stylex';

type AvatarProps = {
  src?: string | null;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  xstyle?: stylex.StyleXStyles;
};

function Avatar({ src, alt, size: sizeProp = 'md', xstyle }: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const imageSrc = src && src !== failedSrc ? src : noImage;

  return (
    <span {...stylex.props(size[sizeProp], styles.wrapper, xstyle)}>
      <img
        {...stylex.props(styles.avatar)}
        alt={alt}
        src={imageSrc}
        onError={() => {
          if (src && imageSrc !== noImage) {
            setFailedSrc(src);
          }
        }}
      />
    </span>
  );
}

export default Avatar;
