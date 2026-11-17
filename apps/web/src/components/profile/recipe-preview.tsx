import type { RecipeCard } from '@repo/shared';
import * as stylex from '@stylexjs/stylex';
import { Link } from 'react-router';

import Button from '@/components/shared/button/button';
import Icon from '@/components/shared/icon/icon';
import ResponsiveImage from '@/components/shared/responsive-image/responsive-image';
import { typography } from '@/styles/typography.stylex';

import { styles } from './profile.stylex';

export default function RecipePreview({
  recipe,
  onRemove,
  isPending = false,
  removeLabel,
}: {
  recipe: RecipeCard;
  onRemove?: () => void;
  isPending?: boolean;
  removeLabel?: string;
}) {
  const href = `/recipe/${recipe.id}`;
  return (
    <article {...stylex.props(styles.row)} aria-busy={isPending}>
      <Link to={href} aria-label={`View recipe: ${recipe.title}`}>
        <ResponsiveImage
          src={recipe.thumb}
          alt=""
          preset={{ desktop: 'recipePreview' }}
          wrapperXstyle={styles.recipeImage}
        />
      </Link>
      <div {...stylex.props(styles.recipeCopy)}>
        <h3 {...stylex.props(styles.recipeTitle)} title={recipe.title}>
          <Link to={href} {...stylex.props(styles.titleLink)}>
            {recipe.title}
          </Link>
        </h3>
        <p {...stylex.props(typography.main, styles.description)}>{recipe.description}</p>
      </div>
      <div {...stylex.props(styles.actions)}>
        <Button
          to={href}
          variant="outline"
          shape="circle"
          xstyle={styles.circle}
          aria-label={`View recipe: ${recipe.title}`}
        >
          <Icon name="arrow-up-right" />
        </Button>
        {onRemove && (
          <Button
            variant="outline"
            shape="circle"
            xstyle={styles.circle}
            disabled={isPending}
            onClick={onRemove}
            aria-label={removeLabel}
          >
            <Icon name="trash" />
          </Button>
        )}
      </div>
    </article>
  );
}
