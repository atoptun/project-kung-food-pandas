import { useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';

import { useCategoriesQuery } from '@/api/dictionaries/dictionaries.queries';
import Categories from '@/components/categories/categories';
import Hero from '@/components/home/hero/hero';
import Testimonials from '@/components/home/testimonials/testimonials';
import RecipesCatalog, {
  type Category,
} from '@/components/recipes/recipes-catalog/recipes-catalog';
import { notify } from '@/lib/notify';
import { useRecipeFiltersStore } from '@/stores/recipe-filters.store';

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
      contentSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

    // Clear global filters store when leaving the page
    return () => {
      useRecipeFiltersStore.getState().resetFilters();
    };
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

  return (
    <>
      <Hero />
      <div ref={contentSectionRef}>
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
