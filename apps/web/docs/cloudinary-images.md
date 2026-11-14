# Cloudinary Images & Responsive DPI Guide

All user and remote images (avatars, recipes, ingredients, categories) should be rendered through `@/shared/utils/cloudinary`.

Cloudinary automatically applies:

- `f_auto` — serves modern formats (AVIF or WebP) depending on browser support.
- `q_auto` — compresses quality without visible degradation.
- Immutable browser caching (`Cache-Control: public, max-age=31536000, immutable`).

---

## 1. Quick Usage: `getCloudinarySrcSet` (Recommended)

For fixed-size elements (avatars, ingredient badges, recipe thumbnails), use `getCloudinarySrcSet()`. It generates `1x` and `2x` (Retina) URLs automatically.

```tsx
import { getCloudinarySrcSet } from '@/shared/utils/cloudinary';

export function UserAvatar({ avatarUrl, name }: { avatarUrl?: string; name: string }) {
  const avatar = getCloudinarySrcSet(avatarUrl, 'avatarHeader');

  return (
    <img
      src={avatar.src}
      srcSet={avatar.srcSet}
      alt={name}
      width={40}
      height={40}
      loading="lazy"
      decoding="async"
    />
  );
}
```

---

## 2. Advanced Usage: `buildCloudinaryUrl`

If you need fine-grained control or custom dimensions:

```tsx
import { buildCloudinaryUrl } from '@/shared/utils/cloudinary';

// 1. Using a preset with high-DPI (e.g. 2x)
const highResThumbnail = buildCloudinaryUrl(recipe.thumb, {
  preset: 'recipeCardDesktop',
  dpr: 2,
});

// 2. Custom dimensions
const customBanner = buildCloudinaryUrl(recipe.thumb, {
  width: 600,
  height: 400,
  crop: 'fill',
  dpr: 1,
});
```

---

## 3. Available Design System Presets

Presets match exact Figma dimensions:

| Preset                      | Target Dimensions | Crop / Gravity   | Usage                                 |
| :-------------------------- | :---------------- | :--------------- | :------------------------------------ |
| **`avatarHeader`**          | `40 × 40 px`      | `c_fill, g_face` | UserBar in Header                     |
| **`avatarTestimonial`**     | `60 × 60 px`      | `c_fill, g_face` | Testimonials slider cards             |
| **`avatarProfile`**         | `120 × 120 px`    | `c_fill, g_face` | User profile page                     |
| **`ingredient`**            | `100 × 100 px`    | `c_fill, g_auto` | Add recipe form, selection list       |
| **`ingredientSmall`**       | `85 × 85 px`      | `c_fill, g_auto` | Recipe details ingredients list       |
| **`recipeCardMobile`**      | `343 × 250 px`    | `c_fill, g_auto` | Recipe card on mobile screens         |
| **`recipeCardDesktop`**     | `342 × 369 px`    | `c_fill, g_auto` | Recipe card on tablet & desktop       |
| **`recipeMini`**            | `60 × 60 px`      | `c_fill, g_auto` | Recent recipes mini cards in UserCard |
| **`recipeDetail`**          | `551 × 400 px`    | `c_fill, g_auto` | Hero recipe image on Recipe page      |
| **`categoryMobile`**        | `343 × 250 px`    | `c_fill, g_auto` | Category cards on mobile              |
| **`categoryTablet`**        | `704 × 369 px`    | `c_fill, g_auto` | Category cards on tablet              |
| **`categoryDesktop`**       | `590 × 369 px`    | `c_fill, g_auto` | Wide category cards on desktop        |
| **`categoryDesktopNarrow`** | `325 × 369 px`    | `c_fill, g_auto` | Narrow category cards on desktop      |

---

## 4. Fallback Safety

If `url` is not a Cloudinary upload URL (e.g., local mock `/assets/...`, OAuth Google avatar `lh3.googleusercontent.com`, or empty string), `buildCloudinaryUrl` returns the original string without modifying it.
