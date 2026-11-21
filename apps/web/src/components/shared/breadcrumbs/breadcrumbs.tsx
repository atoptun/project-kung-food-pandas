import * as stylex from '@stylexjs/stylex';
import { Link } from 'react-router';

import { styles } from './breadcrumbs.stylex';

export type BreadcrumbItem = {
  label: string;
  to?: string;
};

export type BreadcrumbsProps = {
  items: readonly BreadcrumbItem[];
};

function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol {...stylex.props(styles.list)}>
        {items.map(({ to, label }, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <li key={label}>
              {index > 0 && (
                <span aria-hidden="true" {...stylex.props(styles.separator)}>
                  /
                </span>
              )}
              {to ? (
                <Link {...stylex.props(styles.link)} to={to}>
                  {label}
                </Link>
              ) : (
                <span
                  {...stylex.props(isCurrent && styles.current)}
                  aria-current={isCurrent ? 'page' : undefined}
                >
                  {label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
