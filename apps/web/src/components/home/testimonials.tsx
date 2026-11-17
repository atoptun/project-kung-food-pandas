import * as stylex from '@stylexjs/stylex';
import { useEffect, useState } from 'react';

import { useTestimonialsQuery } from '@/api/testimonials/testimonials.queries';
import Button from '@/components/shared/button/button';
import Container from '@/components/shared/container/container';
import { typography } from '@/styles/typography.stylex';

import { styles } from './home.stylex';

export default function Testimonials() {
  const { data, isPending, isError, isFetching, refetch } = useTestimonialsQuery();
  const [activeId, setActiveId] = useState<string>();
  const [paused, setPaused] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const items = data?.items;
  const index = Math.max(0, items?.findIndex((item) => item.id === activeId) ?? 0);
  const active = items?.[index];

  useEffect(() => {
    if (!items || items.length < 2 || paused || hovered || focused) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActiveId(items[(index + 1) % items.length]!.id);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [items, index, paused, hovered, focused]);

  return (
    <Container>
      <section
        aria-labelledby="testimonials-title"
        aria-roledescription="carousel"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
        }}
        {...stylex.props(styles.testimonials)}
      >
        <p {...stylex.props(typography.main)}>What our customer say</p>
        <h2 id="testimonials-title" {...stylex.props(typography.h2, styles.testimonialHeading)}>
          Testimonials
        </h2>
        {isPending && (
          <p role="status" {...stylex.props(styles.status)}>
            Loading testimonials…
          </p>
        )}
        {isError && (
          <div role="alert" {...stylex.props(styles.status)}>
            <p>Could not load testimonials.</p>
            <Button variant="outline" disabled={isFetching} onClick={() => void refetch()}>
              Try again
            </Button>
          </div>
        )}
        {items?.length === 0 && (
          <p role="status" {...stylex.props(styles.status)}>
            No testimonials yet.
          </p>
        )}
        {active && (
          <>
            <figure
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${items!.length}`}
              aria-live={paused || focused ? 'polite' : 'off'}
              {...stylex.props(styles.quote)}
            >
              <span aria-hidden="true" {...stylex.props(styles.quoteMark)}>
                “
              </span>
              <blockquote {...stylex.props(styles.quoteText)}>{active.testimonial}</blockquote>
              <figcaption {...stylex.props(styles.quoteAuthor)}>{active.owner.name}</figcaption>
            </figure>
            {items!.length > 1 && (
              <div
                role="group"
                aria-label="Testimonial controls"
                {...stylex.props(styles.indicators)}
              >
                {items!.map((item, itemIndex) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={`Show testimonial ${itemIndex + 1}`}
                    aria-current={itemIndex === index ? 'true' : undefined}
                    onClick={() => setActiveId(item.id)}
                    {...stylex.props(styles.dot)}
                  >
                    <span
                      {...stylex.props(styles.dotInner, itemIndex === index && styles.dotActive)}
                    />
                  </button>
                ))}
                <button
                  type="button"
                  aria-label={paused ? 'Play testimonials' : 'Pause testimonials'}
                  aria-pressed={paused}
                  onClick={() => setPaused(!paused)}
                  {...stylex.props(styles.autoplay)}
                >
                  {paused ? '▷' : 'Ⅱ'}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </Container>
  );
}
