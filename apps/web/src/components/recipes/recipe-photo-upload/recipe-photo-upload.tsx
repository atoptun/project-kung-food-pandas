import * as stylex from '@stylexjs/stylex';
import { useId, useLayoutEffect, useRef } from 'react';

import {
  recipePhotoAccept,
  recipePhotoError,
} from '@/components/recipes/add-recipe-form/add-recipe.validation';
import Icon from '@/components/shared/icon/icon';
import { typography } from '@/styles/typography.stylex';

import { styles } from './recipe-photo-upload.stylex';

type RecipePhotoUploadProps = {
  file: File | null;
  onChange: (file: File) => void;
  error?: string;
};

function RecipePhotoUpload({ file, onChange, error }: RecipePhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const errorId = useId();
  const fileError = error ?? (file ? recipePhotoError(file) : undefined);
  const validFile = file && !recipePhotoError(file) ? file : null;

  useLayoutEffect(() => {
    const image = imageRef.current;
    if (!validFile || !image) return;
    const url = URL.createObjectURL(validFile);
    // The URL is an external browser resource owned by this image, never form state.
    image.src = url;
    return () => {
      image.removeAttribute('src');
      URL.revokeObjectURL(url);
    };
  }, [validFile]);

  const uploadButton = (
    <button
      type="button"
      {...stylex.props(styles.upload)}
      aria-invalid={fileError ? true : undefined}
      aria-describedby={fileError ? errorId : undefined}
      onClick={() => inputRef.current?.click()}
    >
      {validFile ? 'Upload another photo' : 'Upload a photo'}
    </button>
  );

  return (
    <div {...stylex.props(styles.field)}>
      <input
        ref={inputRef}
        type="file"
        name="photo"
        aria-label="Recipe photo"
        accept={recipePhotoAccept}
        hidden
        onChange={(event) => {
          const selected = event.currentTarget.files?.[0];
          // Clear the native selection so replacement/reset can select the same file again.
          event.currentTarget.value = '';
          if (selected) onChange(selected);
        }}
      />
      <div {...stylex.props(styles.frameWrapper)}>
        {validFile ? (
          <img ref={imageRef} {...stylex.props(styles.photo)} alt="Recipe preview" />
        ) : (
          <>
            <Icon name="photo-frame" xstyle={styles.frame} />
            <div {...stylex.props(styles.empty)}>
              <Icon name="upload-photo" size={64} />
              {uploadButton}
            </div>
          </>
        )}
      </div>
      {validFile && <div {...stylex.props(styles.replace)}>{uploadButton}</div>}
      {fileError && (
        <p id={errorId} {...stylex.props(typography.caption, styles.error)}>
          {fileError}
        </p>
      )}
    </div>
  );
}

export default RecipePhotoUpload;
