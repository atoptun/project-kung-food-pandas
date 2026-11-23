import * as stylex from '@stylexjs/stylex';
import { Link } from 'react-router';

import AuthorButton from '@/components/recipes/author-button/author-button';
import Button from '@/components/shared/button/button';
import Icon from '@/components/shared/icon/icon';
import ResponsiveImage from '@/components/shared/responsive-image/responsive-image';
import { typography } from '@/styles/typography.stylex';

import { styles } from './recipe-card.stylex';

export interface RecipeCardAuthor {
  id: string;
  name: string;
  avatar?: string | null;
}

export interface RecipeCardProps {
  id: string;
  slug?: string | null;
  title: string;
  description: string;
  image?: string | null;
  author: RecipeCardAuthor;
  isFavorite?: boolean;
  isFavoriteLoading?: boolean;
  onToggleFavorite?: (id: string) => void;
  xstyle?: stylex.StyleXStyles;
}

export function RecipeCard({
  id,
  slug,
  title,
  description,
  image,
  author,
  isFavorite = false,
  isFavoriteLoading = false,
  onToggleFavorite,
  xstyle,
}: RecipeCardProps) {
  const recipeHref = `/recipe/${slug || id}`;

  return (
    <article {...stylex.props(styles.card, stylex.defaultMarker(), xstyle)}>
      <Link
        to={recipeHref}
        aria-label={`View recipe: ${title}`}
        {...stylex.props(styles.imageLink)}
      >
        <ResponsiveImage
          src={image}
          alt={title}
          preset={{
            mobile: 'recipeCardMobile',
            desktop: 'recipeCard',
          }}
          placeholderSize={128}
          wrapperXstyle={styles.imageWrapper}
          imgXstyle={styles.image}
          placeholderXstyle={styles.noImage}
        />
      </Link>

      <div {...stylex.props(styles.content)}>
        <h3 {...stylex.props(typography.h3, styles.title)} title={title}>
          <Link to={recipeHref} {...stylex.props(styles.titleLink)}>
            {title}
          </Link>
        </h3>

        <p {...stylex.props(typography.main, styles.description)} title={description}>
          {description}
        </p>

        <footer {...stylex.props(styles.footer)}>
          <AuthorButton author={author} />

          <div {...stylex.props(styles.actions)}>
            <Button
              shape="circle"
              aria-label={
                isFavorite ? `Remove ${title} from favorites` : `Add ${title} to favorites`
              }
              aria-pressed={isFavorite}
              disabled={isFavoriteLoading}
              onClick={() => onToggleFavorite?.(id)}
              xstyle={[
                styles.circleBtn,
                isFavorite ? styles.favoriteActive : styles.favoriteInactive,
              ]}
            >
              <Icon name="heart" size={18} xstyle={isFavorite ? styles.heartFilled : undefined} />
            </Button>

            <Button
              shape="circle"
              variant="outline"
              to={recipeHref}
              aria-label={`View recipe: ${title}`}
              xstyle={[styles.circleBtn]}
            >
              <Icon name="arrow-up-right" size={18} />
            </Button>
          </div>
        </footer>
      </div>
    </article>
  );
}

export default RecipeCard;
