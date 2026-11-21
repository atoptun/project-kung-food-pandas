import { useEffect } from 'react';
import { useParams } from 'react-router';

import RecipeView from '@/components/recipes/recipe-view/recipe-view';

export default function RecipePage() {
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return <RecipeView key={id} id={id} />;
}
