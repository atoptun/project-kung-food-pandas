import * as stylex from '@stylexjs/stylex';

import AreaSelect from '@/components/areas/area-select/area-select';
import IngredientSelect from '@/components/ingredients/ingredient-select/ingredient-select';

import { styles } from './recipe-filters.stylex';

export type RecipeFiltersValues = {
  ingredientId?: string;
  areaId?: string;
};

export type RecipeFiltersProps = {
  ingredientId: string;
  areaId: string;
  onIngredientChange: (ingredientId: string) => void;
  onAreaChange: (areaId: string) => void;
  xstyle?: stylex.StyleXStyles;
};

export function RecipeFilters({
  ingredientId,
  areaId,
  onIngredientChange,
  onAreaChange,
  xstyle,
}: RecipeFiltersProps) {
  return (
    <div {...stylex.props(styles.container, xstyle)}>
      <IngredientSelect
        value={ingredientId}
        onValueChange={onIngredientChange}
        useSlug
        placeholder="Ingredients"
        aria-label="Filter by ingredient"
        includeAllOption
        allOptionLabel="All ingredients"
        allOptionValue=""
        xstyle={styles.control}
      />
      <AreaSelect
        value={areaId}
        onValueChange={onAreaChange}
        useSlug
        placeholder="Area"
        aria-label="Filter by area"
        includeAllOption
        allOptionLabel="All areas"
        allOptionValue=""
        xstyle={styles.control}
      />
    </div>
  );
}

export default RecipeFilters;
