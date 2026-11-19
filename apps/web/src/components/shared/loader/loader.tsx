import * as stylex from '@stylexjs/stylex';

import { styles } from './loader.stylex';

export type LoaderSize = 'sm' | 'md' | 'lg';
export type LoaderColor = 'dark' | 'light';

export type LoaderProps = {
  size?: LoaderSize;
  color?: LoaderColor;
  centered?: boolean;
  fullscreen?: boolean;
  label?: string;
  xstyle?: stylex.StyleXStyles;
};

export function Loader({
  size = 'md',
  color = 'dark',
  centered = false,
  fullscreen = false,
  label = 'Loading...',
  xstyle,
}: LoaderProps) {
  const sizeStyle = size === 'sm' ? styles.sizeSm : size === 'lg' ? styles.sizeLg : styles.sizeMd;
  const colorStyle = color === 'light' ? styles.colorLight : styles.colorDark;

  return (
    <div
      role="status"
      aria-label={label}
      {...stylex.props(
        styles.container,
        centered && styles.centered,
        fullscreen && styles.fullscreen,
        xstyle,
      )}
    >
      <div {...stylex.props(styles.spinner, sizeStyle, colorStyle)} />
      <span {...stylex.props(styles.srOnly)}>{label}</span>
    </div>
  );
}

export default Loader;
