import { useRef, useState } from 'react';

import Categories from '@/components/categories/categories';
import Hero from '@/components/home/hero/hero';
import Testimonials from '@/components/home/testimonials/testimonials';
import RecipesCatalog, {
  type Category,
} from '@/components/recipes/recipes-catalog/recipes-catalog';

export function HomeView() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const contentSectionRef = useRef<HTMLDivElement>(null);

  const scrollToContent = () => {
    if (typeof contentSectionRef.current?.scrollIntoView === 'function') {
      contentSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectCategory = (id: string | null, name = 'All categories') => {
    setSelectedCategory({ id, name });
    scrollToContent();
  };

  const handleBack = () => {
    setSelectedCategory(null);
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
