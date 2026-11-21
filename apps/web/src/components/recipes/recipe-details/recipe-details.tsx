import * as stylex from '@stylexjs/stylex';
import { useId } from 'react';
import { Link } from 'react-router';

import { useFavorites } from '@/api/favorites/favorites.queries';
import type { RecipeDetails as RecipeDetailsData } from '@/api/recipes/recipes.types';
import IngredientItem from '@/components/recipes/ingredient-item/ingredient-item';
import Avatar from '@/components/shared/avatar/avatar';
import Button from '@/components/shared/button/button';
import ResponsiveImage from '@/components/shared/responsive-image/responsive-image';
import { typography } from '@/styles/typography.stylex';

import { styles } from './recipe-details.stylex';

export interface RecipeDetailsProps {
  recipe: RecipeDetailsData;
}

/** Splits the instructions into paragraphs (the API keeps line breaks, sometimes as `\r\n`). */
function toParagraphs(text: string | null | undefined) {
  return (text ?? '')
    .split(/\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function RecipeDetails({ recipe }: RecipeDetailsProps) {
  const { isFavorite, isFavoritePending, toggleFavorite } = useFavorites();
  const titleId = useId();
  const ingredientsId = useId();
  const preparationId = useId();

  const { title, thumb, description, time, category, owner, ingredients, instructions } = recipe;
  const paragraphs = toParagraphs(instructions);

  const favorite = isFavorite(recipe);
  const pending = isFavoritePending(recipe.id);

  return (
    <article aria-labelledby={titleId} {...stylex.props(styles.details)}>
      <ResponsiveImage
        src={thumb}
        alt={title}
        preset={{ mobile: 'recipeDetailMobile', desktop: 'recipeDetailTablet' }}
        placeholderSize={120}
        wrapperXstyle={styles.imageWrapper}
        imgXstyle={styles.image}
      />

      <div {...stylex.props(styles.info)}>
        <div {...stylex.props(styles.section)}>
          <h1 id={titleId} {...stylex.props(typography.h3, styles.title)}>
            {title}
          </h1>

          {(category?.name || time) && (
            <ul aria-label="Recipe details" {...stylex.props(styles.tags)}>
              {category?.name && <li {...stylex.props(styles.tag)}>{category.name}</li>}
              {time ? <li {...stylex.props(styles.tag)}>{time} min</li> : null}
            </ul>
          )}

          {description && <p {...stylex.props(typography.main, styles.text)}>{description}</p>}

          {owner && (
            <Link to={`/user/${owner.id}`} {...stylex.props(styles.author)}>
              <Avatar src={owner.avatar} alt="" size="sm" />
              <span {...stylex.props(styles.authorText)}>
                <span {...stylex.props(styles.authorLabel)}>Created by:</span>
                <span {...stylex.props(typography.mainBold, styles.authorName)}>{owner.name}</span>
              </span>
            </Link>
          )}
        </div>

        <section aria-labelledby={ingredientsId} {...stylex.props(styles.section)}>
          <h2 id={ingredientsId} {...stylex.props(styles.sectionTitle)}>
            Ingredients
          </h2>

          {ingredients.length > 0 ? (
            <ul {...stylex.props(styles.ingredients)}>
              {ingredients.map((ingredient) => (
                <li key={ingredient.id} {...stylex.props(styles.ingredient)}>
                  <IngredientItem
                    id={ingredient.id}
                    name={ingredient.name}
                    measure={ingredient.measure ?? ''}
                    image={ingredient.img}
                    xstyle={styles.ingredientItem}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p {...stylex.props(typography.main, styles.text)}>No ingredients listed.</p>
          )}
        </section>

        <section aria-labelledby={preparationId} {...stylex.props(styles.section)}>
          <h2 id={preparationId} {...stylex.props(styles.sectionTitle)}>
            Recipe preparation
          </h2>

          {paragraphs.length > 0 ? (
            paragraphs.map((paragraph, index) => (
              <p
                key={`${index}-${paragraph.slice(0, 24)}`}
                {...stylex.props(typography.main, styles.text)}
              >
                {paragraph}
              </p>
            ))
          ) : (
            <p {...stylex.props(typography.main, styles.text)}>No instructions provided.</p>
          )}
        </section>

        <Button
          requireAuth
          variant={favorite ? 'solid' : 'outline'}
          aria-busy={pending}
          disabled={pending}
          onClick={() => toggleFavorite(recipe)}
          xstyle={[typography.button, styles.favoriteButton]}
        >
          {favorite ? 'Remove from favorites' : 'Add to favorites'}
        </Button>
      </div>
    </article>
  );
}

export default RecipeDetails;
