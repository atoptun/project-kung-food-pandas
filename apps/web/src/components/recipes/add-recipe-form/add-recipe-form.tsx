import * as stylex from '@stylexjs/stylex';
import { useFormik } from 'formik';
import { type ChangeEvent, useId, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

import { useCreateRecipeMutation } from '@/api/recipes/recipes.queries';
import AreaSelect from '@/components/areas/area-select/area-select';
import CategorySelect from '@/components/categories/category-select/category-select';
import CookingTimeControl from '@/components/recipes/cooking-time-control/cooking-time-control';
import RecipeIngredientsEditor from '@/components/recipes/recipe-ingredients-editor/recipe-ingredients-editor';
import RecipePhotoUpload from '@/components/recipes/recipe-photo-upload/recipe-photo-upload';
import Button from '@/components/shared/button/button';
import Icon from '@/components/shared/icon/icon';
import Input from '@/components/shared/input/input';
import Textarea from '@/components/shared/textarea/textarea';
import { typography, weights } from '@/styles/typography.stylex';

import {
  initialRecipeValues,
  type RecipeFormValues,
  recipeValidationSchema,
} from './add-recipe.validation';
import { styles } from './add-recipe-form.stylex';

function AddRecipeForm({
  initialValues = initialRecipeValues,
}: {
  initialValues?: RecipeFormValues;
}) {
  const id = useId();
  const navigate = useNavigate();
  const createRecipe = useCreateRecipeMutation();
  const submissionPending = useRef(false);
  const [editorVersion, setEditorVersion] = useState(0);
  const formik = useFormik<RecipeFormValues>({
    initialValues,
    validationSchema: recipeValidationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onReset: () => setEditorVersion((version) => version + 1),
    onSubmit: async (rawValues) => {
      if (submissionPending.current) return;
      submissionPending.current = true;
      try {
        const values = recipeValidationSchema.cast(rawValues, {
          stripUnknown: true,
        });
        const created = await createRecipe.mutateAsync(values);
        void navigate(`/recipe/${encodeURIComponent(created.id)}`);
      } catch {
        // MutationCache reports the request error; retain the user's values for retry.
      } finally {
        submissionPending.current = false;
      }
    },
  });

  const pending = formik.isSubmitting || createRecipe.isPending;

  const fieldId = (name: keyof RecipeFormValues) => `${id}-${name}`;
  const errorId = (name: keyof RecipeFormValues) => `${fieldId(name)}-error`;
  const fieldError = (name: keyof RecipeFormValues) => {
    const error = formik.errors[name];
    if (formik.submitCount === 0) return undefined;
    if (typeof error === 'string') return error;
    if (name === 'ingredients' && Array.isArray(error)) {
      return error
        .flatMap((item) => (typeof item === 'string' ? [item] : item ? Object.values(item) : []))
        .find((message) => typeof message === 'string');
    }
    return undefined;
  };
  const accessibility = (name: keyof RecipeFormValues) => ({
    id: fieldId(name),
    'aria-invalid': fieldError(name) ? true : undefined,
    'aria-describedby': fieldError(name) ? errorId(name) : undefined,
  });

  const renderError = (name: keyof RecipeFormValues) => {
    const error = fieldError(name);
    return error ? (
      <p id={errorId(name)} {...stylex.props(typography.caption, styles.error)}>
        {error}
      </p>
    ) : null;
  };

  function changeValue<K extends keyof RecipeFormValues>(name: K, value: RecipeFormValues[K]) {
    void formik.setFieldValue(name, value, false);
    formik.setFieldError(name, undefined);
  }

  function handleTextChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    formik.handleChange(event);
    formik.setFieldError(event.target.name, undefined);
  }

  return (
    <form
      aria-label="Add recipe"
      aria-busy={pending}
      noValidate
      onSubmit={formik.handleSubmit}
      onReset={(event) => {
        event.preventDefault();
        if (submissionPending.current || pending) return;
        formik.resetForm({ values: initialRecipeValues });
      }}
      {...stylex.props(styles.form)}
    >
      <RecipePhotoUpload
        file={formik.values.photo}
        onChange={(file) => changeValue('photo', file)}
        error={fieldError('photo')}
      />
      <div {...stylex.props(styles.content)}>
        <div {...stylex.props(styles.groups)}>
          <div {...stylex.props(styles.name)}>
            <div {...stylex.props(styles.field)}>
              <label htmlFor={fieldId('title')} {...stylex.props(styles.visuallyHidden)}>
                Recipe name
              </label>
              <Input
                {...formik.getFieldProps('title')}
                {...accessibility('title')}
                onChange={handleTextChange}
                xstyle={[typography.h3, styles.title]}
                variant="underline"
                placeholder="The name of the recipe"
                maxLength={255}
                required
              />
              {renderError('title')}
            </div>
            <div {...stylex.props(styles.field)}>
              <label htmlFor={fieldId('description')} {...stylex.props(styles.visuallyHidden)}>
                Description
              </label>
              <Textarea
                {...formik.getFieldProps('description')}
                {...accessibility('description')}
                onChange={handleTextChange}
                placeholder="Enter a description of the dish"
                rows={1}
                maxLength={200}
                required
              />
              {renderError('description')}
            </div>
          </div>
          <div {...stylex.props(styles.metadata)}>
            <div {...stylex.props(styles.field)}>
              <label
                htmlFor={fieldId('categoryId')}
                {...stylex.props(typography.h4, weights.extraBold, styles.label)}
              >
                Category
              </label>
              <CategorySelect
                {...accessibility('categoryId')}
                name="categoryId"
                value={formik.values.categoryId}
                onValueChange={(value) => changeValue('categoryId', value)}
                onBlur={() => void formik.setFieldTouched('categoryId', true, false)}
              />
              {renderError('categoryId')}
            </div>
            <div {...stylex.props(styles.field)}>
              <label
                htmlFor={fieldId('time')}
                {...stylex.props(typography.h4, weights.extraBold, styles.label)}
              >
                Cooking time
              </label>
              <CookingTimeControl
                {...accessibility('time')}
                name="time"
                value={formik.values.time}
                onValueChange={(value) => changeValue('time', value)}
                onBlur={formik.handleBlur}
              />
              {renderError('time')}
            </div>
          </div>
          <div {...stylex.props(styles.field)}>
            <label
              htmlFor={fieldId('areaId')}
              {...stylex.props(typography.h4, weights.extraBold, styles.label)}
            >
              Area
            </label>
            <AreaSelect
              {...accessibility('areaId')}
              name="areaId"
              placeholder="Area"
              value={formik.values.areaId}
              onValueChange={(value) => changeValue('areaId', value)}
              onBlur={() => void formik.setFieldTouched('areaId', true, false)}
            />
            {renderError('areaId')}
          </div>
          <RecipeIngredientsEditor
            key={editorVersion}
            ingredients={formik.values.ingredients}
            onChange={(value) => changeValue('ingredients', value)}
            error={fieldError('ingredients')}
          />
        </div>
        <div {...stylex.props(styles.preparation)}>
          <label
            htmlFor={fieldId('instructions')}
            {...stylex.props(typography.h4, weights.extraBold, styles.sectionTitle)}
          >
            Recipe preparation
          </label>
          <div {...stylex.props(styles.field)}>
            <Textarea
              {...formik.getFieldProps('instructions')}
              {...accessibility('instructions')}
              onChange={handleTextChange}
              placeholder="Enter recipe"
              rows={1}
              maxLength={1000}
              required
            />
            {renderError('instructions')}
          </div>
        </div>
        <div {...stylex.props(styles.actions)}>
          <Button
            disabled={pending}
            type="reset"
            shape="circle"
            variant="outline"
            aria-label="Reset recipe"
          >
            <Icon name="trash" size={20} />
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? 'Publishing…' : 'Publish'}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default AddRecipeForm;
