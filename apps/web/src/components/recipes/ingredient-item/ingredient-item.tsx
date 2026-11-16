import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';

import noImage from '@/assets/no-image.png';
import Icon from '@/components/shared/icon/icon';
import { typography, weights } from '@/styles/typography.stylex';
import { buildCloudinaryUrl } from '@/utils/cloudinary';

import { styles } from './ingredient-item.stylex';

export interface IngredientItemProps {
  id: string;
  name: string;
  measure: string;
  image?: string | null;
  onRemove?: (id: string) => void;
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
  const [hasImageError, setHasImageError] = useState(false);

  const mob1x = buildCloudinaryUrl(image, { preset: 'ingredientMobile', dpr: 1 });
  const mob2x = buildCloudinaryUrl(image, { preset: 'ingredientMobile', dpr: 2 });
  const desk1x = buildCloudinaryUrl(image, { preset: 'ingredient', dpr: 1 });
  const desk2x = buildCloudinaryUrl(image, { preset: 'ingredient', dpr: 2 });

  const isCloudinary = Boolean(mob1x && mob1x !== mob2x);
  const fallbackSrc = !image || hasImageError ? noImage : mob1x;
  const showRemoveButton = Boolean(onRemove);

  return (
    <div {...stylex.props(styles.item, xstyle)}>
      <div {...stylex.props(styles.imageWrapper)}>
        {hasImageError || !image ? (
          <Icon name="no-image" size={50} xstyle={styles.noImage} />
        ) : isCloudinary ? (
          <picture {...stylex.props(styles.picture)}>
            <source media="(min-width: 768px)" srcSet={`${desk1x} 1x, ${desk2x} 2x`} />
            <source srcSet={`${mob1x} 1x, ${mob2x} 2x`} />
            <img
              {...stylex.props(styles.image)}
              src={mob1x}
              alt={name}
              loading="lazy"
              decoding="async"
              onError={() => setHasImageError(true)}
            />
          </picture>
        ) : (
          <img
            {...stylex.props(styles.image)}
            src={fallbackSrc}
            alt={name}
            loading="lazy"
            decoding="async"
            onError={() => setHasImageError(true)}
          />
        )}
      </div>

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
