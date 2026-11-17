# Foodies Design System Cheatsheet

All styling is based on **StyleX**. Do not hardcode hex colors, media queries, or typography dimensions in components.

---

## 1. Imports

```tsx
import * as stylex from '@stylexjs/stylex';
import { breakpoints, colors, fonts, fontWeights, radii } from '@/styles/tokens.stylex';
import { typography, weights } from '@/styles/typography.stylex';
```

---

## 2. Colors (`colors`)

| Token                 | Value                      | Usage                                                   |
| :-------------------- | :------------------------- | :------------------------------------------------------ |
| `colors.black`        | `#050505`                  | Primary text, dark buttons, focused input borders       |
| `colors.darkGray`     | `#1A1A1A`                  | Solid button backgrounds, secondary dark panels         |
| `colors.gray`         | `#BFBEBE`                  | Placeholders, default input borders, character counters |
| `colors.lightGray`    | `#EEEEEE`                  | Tag badges, ingredient pills                            |
| `colors.border`       | `#E8E8E8`                  | Dividers, card outlines, circle button borders          |
| `colors.white`        | `#FFFFFF`                  | Backgrounds, modal surfaces, light text                 |
| `colors.overlayDark`  | `rgba(5, 5, 5, 0.2)`       | Modal backdrop                                          |
| `colors.overlayLight` | `rgba(255, 255, 255, 0.2)` | Translucent white overlays / badges                     |

---

## 3. Breakpoints (`breakpoints`)

- `default` — mobile fluid from `320px` to `375px`
- `[breakpoints.tablet]` — from `768px`
- `[breakpoints.desktop]` — from `1440px`

```tsx
const styles = stylex.create({
  container: {
    paddingInline: {
      default: 16,
      [breakpoints.tablet]: 32,
      [breakpoints.desktop]: 120,
    },
  },
});
```

---

## 4. Typography (`typography`)

All headings scale automatically across Mobile, Tablet, and Desktop:

| Style                 | Mobile  | Tablet / Desktop         | Usage                                     |
| :-------------------- | :------ | :----------------------- | :---------------------------------------- |
| `typography.h1`       | 40 / 40 | 70 / 70 (T), 90 / 90 (D) | Hero title                                |
| `typography.h2`       | 28 / 32 | 40 / 44                  | Section headers, modal titles             |
| `typography.h3`       | 18 / 24 | 24 / 28                  | Recipe card titles, subsections           |
| `typography.h4`       | 18 / 22 | 20 / 24                  | Dropdown headers, tabs                    |
| `typography.main`     | 14 / 20 | 16 / 24                  | Body text (Medium 500)                    |
| `typography.mainBold` | 14 / 20 | 16 / 24                  | Button labels, emphasized text (Bold 700) |
| `typography.caption`  | 12 / 18 | 12 / 18                  | Badge text, counters, pagination          |

### JSX Usage

```tsx
<h1 {...stylex.props(typography.h1)}>Foodies</h1>
<p {...stylex.props(typography.main)}>Recipe description...</p>
```

### Overriding Weight

Combine presets in `stylex.props()` if a specific weight is needed:

```tsx
// Uses h3 dimensions, but with Bold (700) instead of default ExtraBold (800)
<h3 {...stylex.props(typography.h3, weights.bold)}>Custom Card Title</h3>
```

---

## 5. Border Radii (`radii`)

- `radii.pill` (`30px`) — Buttons, search inputs
- `radii.card` (`16px`) — Recipe & category cards
- `radii.modal` (`30px`) — Modal containers (desktop)
- `radii.circle` (`'50%'`) — User avatars, `Button.Circle`

---

## 6. Component Example

```tsx
import * as stylex from '@stylexjs/stylex';
import { breakpoints, colors, radii } from '@/styles/tokens.stylex';
import { typography } from '@/styles/typography.stylex';

const styles = stylex.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    padding: { default: 16, [breakpoints.tablet]: 24 },
  },
  title: {
    color: colors.black,
    marginBottom: 8,
  },
});

export function RecipeCard({ title, desc }: { title: string; desc: string }) {
  return (
    <article {...stylex.props(styles.card)}>
      <h3 {...stylex.props(typography.h3, styles.title)}>{title}</h3>
      <p {...stylex.props(typography.main)}>{desc}</p>
    </article>
  );
}
```
