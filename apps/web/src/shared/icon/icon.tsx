import * as stylex from '@stylexjs/stylex';

import { breakpoints } from '@/styles/tokens.stylex';

const styles = stylex.create({
  icon: (source: string) => ({
    display: 'block',
    width: { default: 16, [breakpoints.tablet]: 18 },
    height: { default: 16, [breakpoints.tablet]: 18 },
    backgroundColor: 'currentColor',
    maskSize: 'contain',
    maskPosition: 'center',
    maskRepeat: 'no-repeat',
    maskImage: source,
  }),
});

type IconProps = {
  src: string;
  xstyle?: stylex.StyleXStyles;
};

export default function Icon({ src, xstyle }: IconProps) {
  return <span {...stylex.props(styles.icon(`url("${src}")`), xstyle)} aria-hidden="true" />;
}
