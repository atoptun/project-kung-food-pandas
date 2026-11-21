import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';

import Icon from '@/components/shared/icon/icon';

import { size, styles } from './avatar.stylex';

type AvatarProps = {
  src?: string | null;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  xstyle?: stylex.StyleXStyles;
};

function Avatar({ src, alt, size: sizeProp = 'xs', xstyle }: AvatarProps) {
  const [hasError, setHasError] = useState(false);

  const shouldRenderImage = Boolean(src) && !hasError;

  return (
    <span {...stylex.props(size[sizeProp], styles.wrapper, xstyle)}>
      {shouldRenderImage ? (
        <img
          {...stylex.props(styles.avatar)}
          alt={alt}
          src={src!}
          onError={() => setHasError(true)}
        />
      ) : (
        <Icon name="user" xstyle={styles.placeholderIcon} />
      )}
    </span>
  );
}

export default Avatar;
