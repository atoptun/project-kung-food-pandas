import slugify from 'slugify';

export interface SlugifyOptions {
  lower?: boolean;
  strict?: boolean;
  trim?: boolean;
  remove?: RegExp;
}

export function toSlug(text: string, options?: SlugifyOptions): string {
  if (!text) return '';
  return slugify(text, {
    lower: true,
    strict: true,
    trim: true,
    ...options,
  });
}
