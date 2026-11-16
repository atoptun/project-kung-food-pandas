import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Link } from 'react-router';

import noImage from '@/assets/no-image.png';
import Avatar from '@/components/shared/avatar/avatar';
import Button from '@/components/shared/button/button';
import Icon from '@/components/shared/icon/icon';
import { typography, weights } from '@/styles/typography.stylex';
import { buildCloudinaryUrl } from '@/utils/cloudinary';

import { styles } from './recipe-card.stylex';

export interface RecipeCardAuthor {
  id: string;
  name: string;
  avatar?: string | null;
}

export interface RecipeCardProps {
  id: string;
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
  title,
  description,
  image,
  author,
  isFavorite = false,
  isFavoriteLoading = false,
  onToggleFavorite,
  xstyle,
}: RecipeCardProps) {
  const [hasImageError, setHasImageError] = useState(false);

  const mob1x = buildCloudinaryUrl(image, { preset: 'recipeCardMobile', dpr: 1 });
  const mob2x = buildCloudinaryUrl(image, { preset: 'recipeCardMobile', dpr: 2 });
  const desk1x = buildCloudinaryUrl(image, { preset: 'recipeCardDesktop', dpr: 1 });
  const desk2x = buildCloudinaryUrl(image, { preset: 'recipeCardDesktop', dpr: 2 });

  const recipeHref = `/recipe/${id}`;
  const authorHref = `/user/${author.id}`;

  const isCloudinary = Boolean(mob1x && mob1x !== mob2x);

  const fallbackSrc = !image || hasImageError ? noImage : mob1x;

  return (
    <article {...stylex.props(styles.card, xstyle)}>
      <div {...stylex.props(styles.imageWrapper)}>
        {hasImageError || !image ? (
          // <img
          //   {...stylex.props(styles.image)}
          //   src={noImage}
          //   alt={title}
          //   loading="lazy"
          //   decoding="async"
          // />
          <Icon name="no-image" size={128} xstyle={styles.noImage} />
        ) : isCloudinary ? (
          <picture {...stylex.props(styles.picture)}>
            <source media="(min-width: 768px)" srcSet={`${desk1x} 1x, ${desk2x} 2x`} />
            <source srcSet={`${mob1x} 1x, ${mob2x} 2x`} />
            <img
              {...stylex.props(styles.image)}
              src={mob1x}
              alt={title}
              loading="lazy"
              decoding="async"
              onError={() => setHasImageError(true)}
            />
          </picture>
        ) : (
          <img
            {...stylex.props(styles.image)}
            src={fallbackSrc}
            alt={title}
            loading="lazy"
            decoding="async"
            onError={() => setHasImageError(true)}
          />
        )}
      </div>

      <div {...stylex.props(styles.content)}>
        <h3 {...stylex.props(typography.h3, styles.title)} title={title}>
          {title}
        </h3>

        <p {...stylex.props(typography.main, styles.description)} title={description}>
          {description}
        </p>

        <footer {...stylex.props(styles.footer)}>
          <Link to={authorHref} {...stylex.props(styles.author)}>
            <Avatar src={author.avatar} alt={author.name} size="xs" />
            <span {...stylex.props(typography.main, weights.bold, styles.authorName)}>
              {author.name}
            </span>
          </Link>

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
              to={recipeHref}
              aria-label={`View recipe: ${title}`}
              xstyle={[styles.circleBtn, styles.arrowBtn]}
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
