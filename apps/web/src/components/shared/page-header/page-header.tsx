import * as stylex from '@stylexjs/stylex';
import type { ElementType, ReactNode } from 'react';

import Breadcrumbs, { type BreadcrumbItem } from '@/components/shared/breadcrumbs/breadcrumbs';
import MainTitle from '@/components/shared/main-title/main-title';
import Subtitle from '@/components/shared/subtitle/subtitle';

import { styles } from './page-header.stylex';

export interface PageHeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  title?: ReactNode;
  titleAs?: ElementType;
  subtitle?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  titleXstyle?: stylex.StyleXStyles;
  subtitleXstyle?: stylex.StyleXStyles;
}

export function PageHeader({
  breadcrumbs,
  title,
  titleAs = 'h1',
  subtitle,
  xstyle,
  titleXstyle,
  subtitleXstyle,
}: PageHeaderProps) {
  const hasBreadcrumbs = Boolean(breadcrumbs && breadcrumbs.length > 0);

  return (
    <div {...stylex.props(styles.header, xstyle)}>
      {hasBreadcrumbs && <Breadcrumbs items={breadcrumbs!} />}
      {title && (
        <MainTitle
          variant={titleAs}
          xstyle={[hasBreadcrumbs && styles.headingWithBreadcrumbs, titleXstyle]}
        >
          {title}
        </MainTitle>
      )}
      {subtitle && <Subtitle xstyle={[styles.subtitle, subtitleXstyle]}>{subtitle}</Subtitle>}
    </div>
  );
}

export default PageHeader;
