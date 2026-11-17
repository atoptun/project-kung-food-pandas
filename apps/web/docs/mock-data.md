# Mock Service Worker (MSW) Guide

This guide explains how to use, configure, and add mock API data in the `@repo/web` application when the backend API is unavailable or under active development.

---

## 1. Overview & Architecture

We use **[Mock Service Worker (MSW)](https://mswjs.io/)** v3.

- Runs exclusively in local development (`import.meta.env.DEV`).
- Intercepts requests at the browser network layer using a Service Worker (`public/mockServiceWorker.js`).
- Unmocked requests automatically bypass MSW and hit the real backend server (`onUnhandledRequest: 'bypass'`).
- Production bundles (`pnpm build`) completely skip MSW.

### Directory Structure

```text
apps/web/src/mocks/
├── data/                    # Static mock JSON files matching @repo/shared schemas
│   └── testimonials.json
├── handlers/                # Route handlers grouped by domain
│   └── testimonials.ts
├── browser.ts               # Service Worker bootstrap & runtime helpers
├── handlers.ts              # Aggregates active handlers according to env settings
```

---

## 2. Enabling Mocks via Environment Variables

Control which endpoints are mocked using `VITE_MOCK_ROUTES` in your root `.env.local`:

```bash
# Mock only testimonials (real backend is used for everything else)
VITE_MOCK_ROUTES=testimonials

# Mock multiple domains (comma-separated)
VITE_MOCK_ROUTES=testimonials,recipes

# Mock all registered domains
VITE_MOCK_ROUTES=all

# Disable all mocks (all traffic goes to real backend)
VITE_MOCK_ROUTES=
```

---

## 3. Runtime Toggle in Browser DevTools Console

You can switch or test mocks on the fly without restarting Vite or editing `.env.local`.

Open Chrome/Firefox DevTools Console:

```javascript
// Enable mocks for testimonials dynamically:
__msw.mockTestimonials();

// Reset/disable mocks (route requests to real backend):
__msw.unmockAll();
```

---

## 4. How to Add a New Mock Domain

Follow these 4 steps:

### Step 1: Create Mock Data JSON

Create `apps/web/src/mocks/data/<domain>.json` adhering to `@repo/shared` schemas.

```json
// apps/web/src/mocks/data/recipes.json
[
  {
    "id": "mock-recipe-1",
    "title": "Pasta Carbonara",
    "description": "Classic creamy pasta",
    "instructions": "1. Boil pasta...",
    "thumb": "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    "ingredients": []
  }
]
```

### Step 2: Create Route Handlers

Create `apps/web/src/mocks/handlers/<domain>.ts`:

```typescript
import { delay, http, HttpResponse } from 'msw';
import type { RecipesListResponse } from '@repo/shared';
import recipesData from '../data/recipes.json';

export const recipesHandlers = [
  http.get('*/recipes', async () => {
    await delay(300); // Simulate network latency
    return HttpResponse.json<RecipesListResponse>({
      items: recipesData,
      total: recipesData.length,
      page: 1,
      totalPages: 1,
      limit: 10,
    });
  }),
];
```

### Step 3: Register in `handlers.ts`

Add the new handler to [apps/web/src/mocks/handlers.ts](file:///home/topa/study/goit/tier_2/9_nodejs/sources/project-kung-food-pandas/apps/web/src/mocks/handlers.ts):

```typescript
import { recipesHandlers } from './handlers/recipes';

// ...
export const handlers: RequestHandler[] = [
  ...(isMockEnabled('testimonials') ? testimonialsHandlers : []),
  ...(isMockEnabled('recipes') ? recipesHandlers : []),
];
```

### Step 4: (Optional) Register in DevTools Helper

In [apps/web/src/mocks/browser.ts](file:///home/topa/study/goit/tier_2/9_nodejs/sources/project-kung-food-pandas/apps/web/src/mocks/browser.ts), expose the new domain in `window.__msw`:

```typescript
window.__msw = {
  // ...
  mockRecipes: () => worker.use(...recipesHandlers),
};
```
