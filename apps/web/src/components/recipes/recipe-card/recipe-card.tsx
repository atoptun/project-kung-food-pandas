import * as stylex from '@stylexjs/stylex';
import { Link } from 'react-router';

import Avatar from '@/components/shared/avatar/avatar';
import Button from '@/components/shared/button/button';
import Icon from '@/components/shared/icon/icon';
import ResponsiveImage from '@/components/shared/responsive-image/responsive-image';
import { useAuth } from '@/hooks/use-auth';
import { useAuthModalStore } from '@/stores/auth-modal.store';
import { typography, weights } from '@/styles/typography.stylex';

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
  const { isAuthenticated, isPending } = useAuth();
  const openSignIn = useAuthModalStore((state) => state.openSignIn);
  const recipeHref = `/recipe/${id}`;
  const authorHref = `/user/${author.id}`;

  return (
    <article {...stylex.props(styles.card, xstyle)}>
      <Link
        to={recipeHref}
        aria-label={`View recipe: ${title}`}
        {...stylex.props(styles.imageLink)}
      >
        <ResponsiveImage
          src={image}
          alt=""
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
          <Link
            to={authorHref}
            onClick={(event) => {
              if (isPending || !isAuthenticated) event.preventDefault();
              if (!isPending && !isAuthenticated) openSignIn();
            }}
            {...stylex.props(styles.author)}
          >
            <Avatar src={author.avatar} alt={author.name} size="sm" />
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
