# Kung Food Pandas

Monorepo foundation for **Kung Food Pandas**, built with **pnpm workspaces** and **Turborepo**.

## Tech Stack

- **Monorepo & Tooling:** Node.js 24 LTS, pnpm, Turborepo, TypeScript, ESLint, Prettier, Husky, lint-staged, commitlint
- **Backend (`apps/api`):** Express, TypeScript (`tsx`, `tsup`), Prisma ORM, PostgreSQL, Zod, Pino, Helmet, CORS, Multer, Cloudinary
- **Frontend (`apps/web`):** React 19 SPA, Vite, TypeScript
- **Shared Contracts (`packages/shared`):** Shared Zod validation schemas & TypeScript DTO types (`@asteasolutions/zod-to-openapi`)
- **API Documentation:** OpenAPI 3.0 generated from Zod schemas, served via `swagger-ui-express` (`/api-docs`) and bundled/built via `@redocly/cli`
- **Testing:** Vitest, Supertest, React Testing Library

## Quick Start

1. **Prerequisites:** Node.js `>=24.0.0`, `pnpm >=10.0.0`, and Docker (for local PostgreSQL).
2. **Environment Setup:**

   ```bash
   cp .env.template .env.local
   ```

3. **Install Dependencies:**

   ```bash
   pnpm install
   ```

4. **Start Local PostgreSQL & Generate Prisma Client:**

   ```bash
   pnpm db:up
   pnpm db:generate
   pnpm db:migrate
   ```

5. **Run Development Servers:**

   ```bash
   pnpm dev
   ```

   - Backend API: `http://localhost:4000`
   - Swagger UI: `http://localhost:4000/api-docs`
   - Liveness / Readiness probes: `http://localhost:4000/healthz` & `http://localhost:4000/readyz`
   - Frontend Web App: `http://localhost:5173`

## Frontend dictionary mocks

Restart the web dev server with this command from the repository root to mock only `GET /categories`, `/areas` and `/ingredients` with the assignment fixtures:

```bash
VITE_MOCK_ROUTES=dictionaries pnpm dev:web
```

Scopes can be combined (`VITE_MOCK_ROUTES=testimonials,dictionaries`), or use `all` for all registered development handlers. This setting is development-only; it does not mock authentication or recipe creation. `/recipe/add` remains private and requires signing in through the configured auth service.

The three dictionaries share the existing QueryClient cache until a full page reload. Add recipe currently validates the form and logs normalized JSON with photo metadata; it does not save a recipe or upload the local file. The file and preview disappear on reset, page exit or reload.

## Documentation & Collaboration

Please read **[CONTRIBUTING.md](./CONTRIBUTING.md)** for branch naming rules, commit message conventions, PR scope isolation, and common commands.

### Add recipe in Storybook

```bash
pnpm --filter @repo/web storybook --port 6007
```

Open **Recipes / Add recipe / Empty** or **Filled**. These interactive stories seed the existing dictionary fixtures in a local QueryClient and use a local photo asset; no API or authentication is required. Reset clears the form, including the filled example. The page itself remains private.
