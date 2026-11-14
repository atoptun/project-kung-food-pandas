import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef } from 'react';

import Button from '@/components/shared/button/button';

import { styles } from './pagination.stylex';

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function getPageItems(page: number, totalPages: number) {
  const pages = [1];

  for (let number = Math.max(2, page - 1); number <= Math.min(totalPages - 1, page + 1); number++) {
    pages.push(number);
  }

  if (totalPages > 1) pages.push(totalPages);

  const items: Array<number | 'previous' | 'next'> = [];
  pages.forEach((number, index) => {
    if (index > 0 && number - pages[index - 1]! > 1) {
      items.push(number <= page ? 'previous' : 'next');
    }
    items.push(number);
  });

  return items;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const currentButtonRef = useRef<HTMLButtonElement>(null);
  const jumpTargetRef = useRef<number | null>(null);

  useEffect(() => {
    if (jumpTargetRef.current === page) currentButtonRef.current?.focus();
    jumpTargetRef.current = null;
  }, [page]);

  if (totalPages < 1) return null;

  return (
    <nav aria-label="Pagination">
      <ul {...stylex.props(styles.list)}>
        {getPageItems(page, totalPages).map((pageNumber) => {
          if (typeof pageNumber !== 'number') {
            const isPrevious = pageNumber === 'previous';

            return (
              <li key={pageNumber}>
                <Button
                  shape="circle"
                  xstyle={styles.button}
                  aria-label={isPrevious ? 'Jump back 2 pages' : 'Jump forward 2 pages'}
                  onClick={() => {
                    const nextPage = Math.min(
                      totalPages,
                      Math.max(1, page + (isPrevious ? -2 : 2)),
                    );
                    jumpTargetRef.current = nextPage;
                    onPageChange(nextPage);
                  }}
                >
                  …
                </Button>
              </li>
            );
          }

          const isCurrent = pageNumber === page;

          return (
            <li key={pageNumber}>
              <Button
                ref={isCurrent ? currentButtonRef : undefined}
                shape="circle"
                xstyle={[styles.button, isCurrent && styles.current]}
                aria-label={`Page ${pageNumber}`}
                aria-current={isCurrent ? 'page' : undefined}
                aria-disabled={isCurrent || undefined}
                onClick={() => {
                  if (!isCurrent) onPageChange(pageNumber);
                }}
              >
                {pageNumber}
              </Button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
