import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef, useState } from 'react';

import { useTestimonialsQuery } from '@/api/testimonials/testimonials.queries';
import Icon from '@/components/shared/icon/icon';
import Loader from '@/components/shared/loader/loader';
import MainTitle from '@/components/shared/main-title/main-title';
import Section from '@/components/shared/section/section';
import Typography from '@/components/shared/typography/typography';

import { styles } from './testimonials.stylex';

export type TestimonialsProps = {
  intervalMs?: number;
  xstyle?: stylex.StyleXStyles;
};

export function Testimonials({ intervalMs = 5000, xstyle }: TestimonialsProps) {
  const { data, isLoading, isError } = useTestimonialsQuery();
  const items = data?.items ?? [];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(() =>
    typeof document !== 'undefined' ? document.visibilityState === 'visible' : true,
  );
  const [isInViewport, setIsInViewport] = useState(
    () => typeof window !== 'undefined' && typeof window.IntersectionObserver === 'undefined',
  );
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    const target = sectionRef.current;
    if (
      !target ||
      typeof window === 'undefined' ||
      typeof window.IntersectionObserver === 'undefined'
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry ? entry.isIntersecting : true);
      },
      { threshold: 0.1 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [items.length]);

  useEffect(() => {
    if (isPaused || !isTabVisible || !isInViewport || items.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPaused, isTabVisible, isInViewport, items.length, intervalMs]);

  if (isLoading) {
    return (
      <Section withContainer aria-label="Testimonials" xstyle={xstyle}>
        <Loader size="lg" centered label="Loading testimonials..." />
      </Section>
    );
  }

  if (isError || items.length === 0) {
    return null;
  }

  const activeItem = items[activeIndex];

  return (
    <Section
      ref={sectionRef}
      withContainer
      aria-label="Testimonials"
      xstyle={xstyle}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div
        {...stylex.props(styles.card)}
        role="region"
        aria-roledescription="carousel"
        aria-label="Customer testimonials"
      >
        <div {...stylex.props(styles.header)}>
          <Typography variant="main" color="darkGray">
            What our customer say
          </Typography>
          <MainTitle xstyle={styles.title}>Testimonials</MainTitle>
        </div>

        <Icon name="quote" size={58} xstyle={styles.quoteIcon} />

        <div
          {...stylex.props(styles.slideWrapper)}
          aria-live="polite"
          role="group"
          aria-roledescription="slide"
          aria-label={`${activeIndex + 1} of ${items.length}`}
        >
          <Typography variant="main" weight="medium" color="black" xstyle={styles.testimonialText}>
            {activeItem?.testimonial}
          </Typography>
          <Typography
            variant="h4"
            weight="extraBold"
            color="black"
            uppercase
            xstyle={styles.authorName}
          >
            {activeItem?.owner?.name ?? 'Anonymous'}
          </Typography>
        </div>

        {items.length > 1 && (
          <div {...stylex.props(styles.dots)} role="tablist" aria-label="Slides">
            {items.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Go to slide ${index + 1}`}
                  onClick={() => setActiveIndex(index)}
                  {...stylex.props(styles.dot, isActive && styles.dotActive)}
                />
              );
            })}
          </div>
        )}
      </div>
    </Section>
  );
}

export default Testimonials;
