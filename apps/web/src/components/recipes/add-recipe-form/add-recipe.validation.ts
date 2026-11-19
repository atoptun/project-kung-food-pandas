import type { CreateRecipeInput } from '@repo/shared';
import * as Yup from 'yup';

export type RecipeFormValues = Omit<CreateRecipeInput, 'time' | 'description'> & {
  description: string;
  time: number | '';
  photo: File | null;
};

export const initialRecipeValues: RecipeFormValues = {
  title: '',
  description: '',
  instructions: '',
  categoryId: '',
  areaId: '',
  time: '',
  ingredients: [],
  photo: null,
};

const photoTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const recipePhotoAccept = photoTypes.join(',');
const maxPhotoSize = 5 * 1024 * 1024;

/** Mirrors the existing upload contract without uploading the local File. */
export function recipePhotoError(file: File | null): string | undefined {
  if (!file) return 'Upload a recipe photo';
  if (!photoTypes.includes(file.type)) return 'Choose a JPEG, PNG or WebP photo';
  if (file.size > maxPhotoSize) return 'Photo must be 5 MiB or smaller';
  return undefined;
}

export const recipeIngredientSchema = Yup.object({
  id: Yup.string()
    .trim()
    .max(32, 'Ingredient ID must be at most 32 characters')
    .required('Select an ingredient'),
  measure: Yup.string()
    .trim()
    .max(100, 'Ingredient quantity must be at most 100 characters')
    .required('Enter an ingredient quantity'),
});

type ValidatedRecipeValues = Omit<RecipeFormValues, 'time' | 'photo'> & {
  time: number;
  photo: File;
};

export const recipeValidationSchema: Yup.ObjectSchema<ValidatedRecipeValues> = Yup.object({
  title: Yup.string()
    .trim()
    .min(2, 'Recipe name must be at least 2 characters')
    .max(255, 'Recipe name must be at most 255 characters')
    .required('Enter a recipe name'),
  description: Yup.string()
    .trim()
    .max(200, 'Description must be at most 200 characters')
    .required('Enter a description'),
  instructions: Yup.string()
    .trim()
    .min(10, 'Preparation instructions must be at least 10 characters')
    .max(1000, 'Preparation instructions must be at most 1000 characters')
    .required('Enter preparation instructions'),
  categoryId: Yup.string()
    .trim()
    .max(32, 'Category ID must be at most 32 characters')
    .required('Select a category'),
  areaId: Yup.string()
    .trim()
    .max(32, 'Area ID must be at most 32 characters')
    .required('Select an area'),
  time: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .typeError('Enter cooking time as a number')
    .integer('Cooking time must be a whole number of minutes')
    .min(1, 'Cooking time must be at least 1 minute')
    .required('Enter cooking time'),
  ingredients: Yup.array(recipeIngredientSchema)
    .min(1, 'Add at least one ingredient')
    .required('Add ingredients')
    .test(
      'unique',
      'Each ingredient can only be added once',
      (items) => !items || new Set(items.map((item) => item.id)).size === items.length,
    ),
  photo: Yup.mixed<File>()
    .required('Upload a recipe photo')
    .test('photo', function (file) {
      const error = recipePhotoError(file);
      return error ? this.createError({ message: error }) : true;
    }),
});
