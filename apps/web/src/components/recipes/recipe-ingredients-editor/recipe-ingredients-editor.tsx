import type { CreateRecipeInput } from '@repo/shared';
import * as stylex from '@stylexjs/stylex';
import { useId, useState } from 'react';
import { ValidationError } from 'yup';

import { useIngredientsQuery } from '@/api/dictionaries';
import IngredientSelect from '@/components/ingredients/ingredient-select/ingredient-select';
import { recipeIngredientSchema } from '@/components/recipes/add-recipe-form/add-recipe.validation';
import IngredientItem from '@/components/recipes/ingredient-item/ingredient-item';
import Button from '@/components/shared/button/button';
import Icon from '@/components/shared/icon/icon';
import Input from '@/components/shared/input/input';
import { typography, weights } from '@/styles/typography.stylex';

import { styles } from './recipe-ingredients-editor.stylex';

type RecipeIngredientsEditorProps = {
  ingredients: CreateRecipeInput['ingredients'];
  onChange: (ingredients: CreateRecipeInput['ingredients']) => void;
  error?: string;
};

type DraftErrors = { id?: string; measure?: string };

function RecipeIngredientsEditor({ ingredients, onChange, error }: RecipeIngredientsEditorProps) {
  const id = useId();
  const [ingredientId, setIngredientId] = useState('');
  const [measure, setMeasure] = useState('');
  const [errors, setErrors] = useState<DraftErrors>({});
  const { data } = useIngredientsQuery();
  const dictionary = new Map((data ?? []).map((item) => [item.id, item]));

  function addIngredient() {
    let ingredient: (typeof ingredients)[number] | undefined;
    const nextErrors: DraftErrors = {};
    try {
      ingredient = recipeIngredientSchema.validateSync(
        { id: ingredientId, measure },
        { abortEarly: false },
      );
    } catch (error) {
      if (!(error instanceof ValidationError)) throw error;
      for (const issue of error.inner) {
        if (issue.path === 'id' || issue.path === 'measure') nextErrors[issue.path] = issue.message;
      }
    }
    if (ingredientId && !dictionary.has(ingredientId))
      nextErrors.id = 'Select an available ingredient';
    if (ingredients.some((item) => item.id === ingredientId))
      nextErrors.id = 'This ingredient has already been added';
    setErrors(nextErrors);
    if (!ingredient || Object.keys(nextErrors).length > 0) return;

    onChange([...ingredients, ingredient]);
    setIngredientId('');
    setMeasure('');
  }

  return (
    <section aria-labelledby={`${id}-heading`} aria-describedby={error ? `${id}-error` : undefined}>
      <h3 id={`${id}-heading`} {...stylex.props(typography.h4, weights.extraBold, styles.heading)}>
        Ingredients
      </h3>
      <div {...stylex.props(styles.body)}>
        <div {...stylex.props(styles.fields)}>
          <div {...stylex.props(styles.field)}>
            <label htmlFor={`${id}-ingredient`} {...stylex.props(styles.visuallyHidden)}>
              Ingredient
            </label>
            <IngredientSelect
              id={`${id}-ingredient`}
              name="ingredientDraft"
              placeholder="Add the ingredient"
              value={ingredientId}
              excludedIds={ingredients.map((item) => item.id)}
              onValueChange={(value) => {
                setIngredientId(value);
                setErrors((current) => ({ ...current, id: undefined }));
              }}
              aria-invalid={errors.id ? true : undefined}
              aria-describedby={errors.id ? `${id}-ingredient-error` : undefined}
            />
            {errors.id && (
              <p id={`${id}-ingredient-error`} {...stylex.props(typography.caption, styles.error)}>
                {errors.id}
              </p>
            )}
          </div>
          <div {...stylex.props(styles.field)}>
            <label htmlFor={`${id}-measure`} {...stylex.props(styles.visuallyHidden)}>
              Ingredient quantity
            </label>
            <Input
              id={`${id}-measure`}
              name="ingredientMeasure"
              variant="underline"
              placeholder="Enter quantity"
              value={measure}
              maxLength={100}
              xstyle={styles.measure}
              onChange={(event) => {
                setMeasure(event.currentTarget.value);
                setErrors((current) => ({ ...current, measure: undefined }));
              }}
              aria-invalid={errors.measure ? true : undefined}
              aria-describedby={errors.measure ? `${id}-measure-error` : undefined}
            />
            {errors.measure && (
              <p id={`${id}-measure-error`} {...stylex.props(typography.caption, styles.error)}>
                {errors.measure}
              </p>
            )}
          </div>
        </div>
        <div {...stylex.props(styles.field)}>
          <Button variant="outline" xstyle={styles.addButton} onClick={addIngredient}>
            Add ingredient <Icon name="plus" />
          </Button>
          {error && (
            <p id={`${id}-error`} {...stylex.props(typography.caption, styles.error)}>
              {error}
            </p>
          )}
        </div>
        {ingredients.length > 0 && (
          <ul aria-label="Added ingredients" {...stylex.props(styles.list)}>
            {ingredients.map((item) => {
              const ingredient = dictionary.get(item.id);
              return (
                <li key={item.id} {...stylex.props(styles.listItem)}>
                  <IngredientItem
                    id={item.id}
                    name={ingredient?.name ?? item.id}
                    image={ingredient?.img}
                    measure={item.measure}
                    onRemove={(removeId) =>
                      onChange(ingredients.filter((item) => item.id !== removeId))
                    }
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

export default RecipeIngredientsEditor;
