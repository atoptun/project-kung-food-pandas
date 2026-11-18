import * as stylex from '@stylexjs/stylex';
import type { ComponentPropsWithRef } from 'react';

import Container from '@/components/shared/container/container';

import { styles } from './section.stylex';

export type SectionProps = Omit<ComponentPropsWithRef<'section'>, 'className' | 'style'> & {
  withContainer?: boolean;
  containerXstyle?: stylex.StyleXStyles;
  xstyle?: stylex.StyleXStyles;
};

export function Section({
  children,
  withContainer = false,
  containerXstyle,
  xstyle,
  ...props
}: SectionProps) {
  const content = withContainer ? (
    <Container xstyle={containerXstyle}>{children}</Container>
  ) : (
    children
  );

  return (
    <section {...props} {...stylex.props(styles.section, xstyle)}>
      {content}
    </section>
  );
}

export default Section;
