import * as stylex from '@stylexjs/stylex';
import { useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';

import { useCategoriesQuery } from '@/api/dictionaries/dictionaries.queries';
import Categories from '@/components/categories/categories';
import Hero from '@/components/home/hero/hero';
import Testimonials from '@/components/home/testimonials/testimonials';
import RecipesCatalog, {
  type Category,
} from '@/components/recipes/recipes-catalog/recipes-catalog';
import PageMeta from '@/components/shared/page-meta/page-meta';
import { notify } from '@/lib/notify';
import { breakpoints } from '@/styles/tokens.stylex';

const styles = stylex.create({
  content: {
    // Offset for the sticky floating header so scrollIntoView leaves space for it
    scrollMarginTop: {
      default: 80,
      [breakpoints.tablet]: 100,
      [breakpoints.desktop]: 110,
    },
  },
});

export function HomeView() {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const { data: categories = [], isLoading } = useCategoriesQuery();
  const contentSectionRef = useRef<HTMLDivElement>(null);

  const selectedCategory = useMemo<Category | null>(() => {
    if (!slug) {
      return null;
    }

    if (slug === 'all') {
      return { id: null, name: 'All categories', slug: 'all' };
    }

    const found = categories.find((cat) => cat.slug === slug || cat.id === slug);
    if (found) {
      return { id: found.id, name: found.name, slug: found.slug };
    }

    return null;
  }, [slug, categories]);

  const scrollToContent = () => {
    setTimeout(() => {
      if (
        contentSectionRef.current &&
        typeof contentSectionRef.current?.scrollIntoView === 'function'
      ) {
        contentSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  useEffect(() => {
    if (isLoading || !slug || slug === 'all') {
      return;
    }

    const exists = categories.some((cat) => cat.slug === slug || cat.id === slug);
    if (!exists) {
      notify.error(`Category "${slug}" not found`);
      navigate('/', { replace: true });
    }
  }, [slug, categories, isLoading, navigate]);

  useEffect(() => {
    if (slug) {
      scrollToContent();
    }
  }, [slug]);

  const handleSelectCategory = (id: string | null, catSlug?: string | null) => {
    const targetSlug = catSlug || id || 'all';
    navigate(`/category/${targetSlug}`, { preventScrollReset: true });
    scrollToContent();
  };

  const handleBack = () => {
    navigate('/', { preventScrollReset: true });
    scrollToContent();
  };

  const pageTitle = selectedCategory ? selectedCategory.name : 'Home';
  const pageDescription = selectedCategory
    ? `Explore our best ${selectedCategory.name.toLowerCase()} recipes. Find delicious culinary ideas and step-by-step cooking instructions.`
    : 'Discover a world of delicious recipes and improve your culinary skills with Foodies.';

  return (
    <>
      <PageMeta title={pageTitle} description={pageDescription} />
      <Hero />
      <div ref={contentSectionRef} {...stylex.props(styles.content)}>
        {!selectedCategory ? (
          <Categories onSelectCategory={handleSelectCategory} />
        ) : (
          <RecipesCatalog category={selectedCategory} onBack={handleBack} />
        )}
      </div>

      <Testimonials />
    </>
  );
}

export default HomeView;
