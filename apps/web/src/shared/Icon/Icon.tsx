import * as stylex from '@stylexjs/stylex';

import { breakpoints } from '@/styles/tokens.stylex';

const styles = stylex.create({
  icon: (source: string, size?: number) => ({
    display: 'block',
    flexShrink: 0,
    width: { default: size ?? 16, [breakpoints.tablet]: size ?? 18 },
    height: { default: size ?? 16, [breakpoints.tablet]: size ?? 18 },
    backgroundColor: 'currentColor',
    maskSize: 'contain',
    maskPosition: 'center',
    maskRepeat: 'no-repeat',
    maskImage: source,
  }),
});

type IconProps = {
  src: string;
  size?: number;
  xstyle?: stylex.StyleXStyles;
};

export default function Icon({ src, size, xstyle }: IconProps) {
  return <span {...stylex.props(styles.icon(`url("${src}")`, size), xstyle)} aria-hidden="true" />;
}
