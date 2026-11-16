import * as stylex from '@stylexjs/stylex';

import Icon from '@/components/shared/icon/icon';
import ResponsiveImage from '@/components/shared/responsive-image/responsive-image';
import { typography, weights } from '@/styles/typography.stylex';

import { styles } from './ingredient-item.stylex';

export interface IngredientItemProps {
  id: string;
  name: string;
  measure: string;
  image?: string | null;
  onRemove?: (id: string) => void;
  isRemoving?: boolean;
  xstyle?: stylex.StyleXStyles;
}

export function IngredientItem({
  id,
  name,
  measure,
  image,
  onRemove,
  xstyle,
}: IngredientItemProps) {
  const showRemoveButton = Boolean(onRemove);

  return (
    <div {...stylex.props(styles.item, xstyle)}>
      <ResponsiveImage
        src={image}
        alt={name}
        preset={{
          mobile: 'ingredientMobile',
          desktop: 'ingredient',
        }}
        placeholderSize={50}
        wrapperXstyle={styles.imageWrapper}
        imgXstyle={styles.image}
        placeholderXstyle={styles.noImage}
      />

      <div {...stylex.props(styles.info)}>
        <p {...stylex.props(typography.main, weights.bold, styles.name)} title={name}>
          {name}
        </p>
        <p {...stylex.props(typography.main, styles.measure)} title={measure}>
          {measure}
        </p>
      </div>

      {showRemoveButton && (
        <button
          type="button"
          {...stylex.props(styles.removeButton)}
          aria-label={`Remove ${name}`}
          onClick={() => onRemove?.(id)}
        >
          <Icon name="cross" size={16} />
        </button>
      )}
    </div>
  );
}

export default IngredientItem;
