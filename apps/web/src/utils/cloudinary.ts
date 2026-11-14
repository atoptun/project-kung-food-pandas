export type ImagePreset =
  // Avatars
  | 'avatarHeader' // 40x40, c_fill, g_face
  | 'avatarTestimonial' // 60x60, c_fill, g_face
  | 'avatarProfile' // 120x120, c_fill, g_face

  // Ingredients
  | 'ingredient' // 100x100, c_fill
  | 'ingredientSmall' // 85x85, c_fill

  // Recipes
  | 'recipeCardMobile' // 343x250, c_fill
  | 'recipeCardDesktop' // 342x369, c_fill
  | 'recipeMini' // 60x60, c_fill
  | 'recipeDetail' // 551x400, c_fill

  // Categories
  | 'categoryMobile' // 343x250, c_fill
  | 'categoryTablet' // 704x369, c_fill
  | 'categoryDesktop' // 590x369, c_fill
  | 'categoryDesktopNarrow'; // 325x369, c_fill

interface PresetConfig {
  w: number;
  h: number;
  c?: 'fill' | 'thumb' | 'fit' | 'scale';
  g?: 'auto' | 'face';
}

export const PRESET_CONFIGS: Record<ImagePreset, PresetConfig> = {
  avatarHeader: { w: 40, h: 40, c: 'fill', g: 'face' },
  avatarTestimonial: { w: 60, h: 60, c: 'fill', g: 'face' },
  avatarProfile: { w: 120, h: 120, c: 'fill', g: 'face' },

  ingredient: { w: 100, h: 100, c: 'fill', g: 'auto' },
  ingredientSmall: { w: 85, h: 85, c: 'fill', g: 'auto' },

  recipeCardMobile: { w: 343, h: 250, c: 'fill', g: 'auto' },
  recipeCardDesktop: { w: 342, h: 369, c: 'fill', g: 'auto' },
  recipeMini: { w: 60, h: 60, c: 'fill', g: 'auto' },
  recipeDetail: { w: 551, h: 400, c: 'fill', g: 'auto' },

  categoryMobile: { w: 343, h: 250, c: 'fill', g: 'auto' },
  categoryTablet: { w: 704, h: 369, c: 'fill', g: 'auto' },
  categoryDesktop: { w: 590, h: 369, c: 'fill', g: 'auto' },
  categoryDesktopNarrow: { w: 325, h: 369, c: 'fill', g: 'auto' },
};

export interface BuildCloudinaryUrlOptions {
  preset?: ImagePreset;
  width?: number;
  height?: number;
  crop?: 'fill' | 'thumb' | 'fit' | 'scale';
  gravity?: 'auto' | 'face';
  dpr?: number;
}

/**
 * Transforms Cloudinary image URLs with automatic format (AVIF/WebP), quality, resizing and DPR.
 * Safely returns the original string if not a valid Cloudinary upload URL.
 */
export function buildCloudinaryUrl(
  url?: string | null,
  options: BuildCloudinaryUrlOptions = {},
): string {
  if (!url || !url.includes('cloudinary.com') || !url.match(/(\/(?:image|video)\/upload\/)/)) {
    return url ?? '';
  }

  const { preset, width, height, crop, gravity, dpr = 1 } = options;

  const presetConfig = preset ? PRESET_CONFIGS[preset] : undefined;
  const w = width ?? presetConfig?.w;
  const h = height ?? presetConfig?.h;
  const c = crop ?? presetConfig?.c ?? 'fill';
  const g = gravity ?? presetConfig?.g ?? 'auto';

  const transformations = ['f_auto', 'q_auto', `dpr_${dpr.toFixed(1)}`];

  if (w) transformations.push(`w_${w}`);
  if (h) transformations.push(`h_${h}`);
  if (w || h) {
    transformations.push(`c_${c}`);
    transformations.push(`g_${g}`);
  }

  const transformString = transformations.join(',');
  return url.replace(/(\/(?:image|video)\/upload\/)/, `$1${transformString}/`);
}

/**
 * Returns src and srcSet attributes for responsive high-DPI (Retina 1x/2x) rendering.
 */
export function getCloudinarySrcSet(url?: string | null, preset?: ImagePreset) {
  const src = buildCloudinaryUrl(url, { preset, dpr: 1 });
  const src2x = buildCloudinaryUrl(url, { preset, dpr: 2 });

  return {
    src,
    srcSet: `${src} 1x, ${src2x} 2x`,
  };
}
