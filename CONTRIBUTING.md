# Contributing Guide

Welcome to **Kung Food Pandas**! This guide defines our workflow, command reference, and automated Git/PR policies for our team.

---

## 1. Repository Structure

```text
kung-food-pandas/
├── apps/
│   ├── api/                    # Express REST API backend (deployed to Render)
│   └── web/                    # React + Vite SPA frontend (deployed to Vercel)
├── packages/
│   ├── shared/                 # Shared Zod schemas, OpenAPI metadata, and TypeScript types
│   └── typescript-config/      # Shared tsconfig bases (base, node, react)
├── scripts/
│   └── validate-git.mjs        # Pre-commit branch & scope isolation validator
├── Dockerfile                  # Multi-stage production Docker build for @repo/api
├── render.yaml                 # Render Blueprint configuration for backend deployment
├── vercel.json                 # Vercel configuration & SPA routing for frontend deployment
├── compose.yaml                # Local PostgreSQL container definition
├── .env.template               # Template for environment variables
└── .env.local                  # Local environment variables (gitignored)
```

---

## 2. Local Development Setup

1. Ensure **Node.js 24 LTS** (`nvm use`) and **pnpm** (`corepack enable pnpm`) are active.
2. Copy the environment template:

   ```bash
   cp .env.template .env.local
   ```

3. Install workspace dependencies:

   ```bash
   pnpm install
   ```

4. Start the local PostgreSQL container via Docker Compose:

   ```bash
   pnpm db:up
   ```

5. Generate the Prisma client and apply migrations:

   ```bash
   pnpm db:generate
   pnpm db:migrate
   ```

6. **Always open VS Code from the monorepo root (`code .`)**, not from `apps/web` or `apps/api` subdirectories. This ensures `.vscode/settings.json`, `.editorconfig`, root ESLint v10, Prettier, and `@repo/shared` TypeScript path resolution work properly.

---

## 3. Command Reference & Dependency Management

Run all commands from the **repository root**:

### Adding & Removing Dependencies (`pnpm --filter`)

Never run `npm install` or `yarn`. Use `pnpm --filter` (or `-F`) from the root directory to target a specific workspace package:

```bash
# Frontend (@repo/web)
pnpm --filter @repo/web add <package>
pnpm --filter @repo/web add -D <dev-package>
pnpm --filter @repo/web remove <package>

# Backend (@repo/api)
pnpm --filter @repo/api add <package>
pnpm --filter @repo/api add -D <dev-package>
pnpm --filter @repo/api remove <package>

# Shared contracts (@repo/shared)
pnpm --filter @repo/shared add <package>

# Monorepo root tooling only (linters, git hooks, build scripts)
pnpm add -D -w <root-tool-package>
```

### Development & Production

| Command            | Description                                                           |
| ------------------ | --------------------------------------------------------------------- |
| `pnpm dev`         | Run all packages (`shared`, `api`, `web`) in watch mode via Turborepo |
| `pnpm dev:api`     | Run only the backend API (`http://localhost:4000`)                    |
| `pnpm dev:web`     | Run only the frontend Vite SPA (`http://localhost:5173`)              |
| `pnpm build`       | Build all packages and applications                                   |
| `pnpm build:api`   | Build `@repo/shared` and `@repo/api` for production (Render)          |
| `pnpm build:web`   | Build `@repo/shared` and `@repo/web` for production (Vercel)          |
| `pnpm start:api`   | Start the compiled production backend (`apps/api/dist/server.js`)     |
| `pnpm preview:web` | Preview the production frontend bundle locally                        |

### Database (Prisma + PostgreSQL)

| Command                  | Description                                                            |
| ------------------------ | ---------------------------------------------------------------------- |
| `pnpm db:up`             | Start local PostgreSQL container in background                         |
| `pnpm db:down`           | Stop local PostgreSQL container                                        |
| `pnpm db:generate`       | Generate Prisma Client                                                 |
| `pnpm db:migrate`        | Create and apply a migration in local development (reads `.env.local`) |
| `pnpm db:migrate:deploy` | Apply pending migrations in production (Render)                        |
| `pnpm db:studio`         | Open Prisma Studio GUI (`http://localhost:5555`)                       |

### API Documentation (Zod-to-OpenAPI & Redocly)

| Command              | Description                                                              |
| -------------------- | ------------------------------------------------------------------------ |
| `pnpm docs:generate` | Generate `apps/api/openapi.yaml` from Zod schemas                        |
| `pnpm docs:lint`     | Validate `openapi.yaml` using `@redocly/cli`                             |
| `pnpm docs:bundle`   | Bundle OpenAPI spec into `apps/api/openapi.bundled.yaml`                 |
| `pnpm docs:build`    | Build standalone HTML documentation into `apps/api/docs-dist/index.html` |
| `pnpm docs:preview`  | Start local Redocly live preview server                                  |

### Code Quality & Testing

| Command             | Description                                                       |
| ------------------- | ----------------------------------------------------------------- |
| `pnpm lint`         | Run ESLint v10 across the monorepo                                |
| `pnpm lint:fix`     | Run ESLint with automatic fixes                                   |
| `pnpm format`       | Format all files with Prettier                                    |
| `pnpm format:check` | Verify formatting in CI                                           |
| `pnpm typecheck`    | Run TypeScript compiler checks across all packages                |
| `pnpm test`         | Run Vitest unit & Supertest integration tests across all packages |

---

## 4. API-First Workflow, Path Aliases & Testing Conventions

### Path Aliases & Imports

- **Internal imports within `apps/api` and `apps/web`:** Use the `@/*` alias mapped to `./src/*` (e.g., `import env from '@/config/env'` or `import { App } from '@/App'`) instead of deep relative paths (`../../`).
- **Shared contracts (`packages/shared`):** Import schemas and types via the workspace package name `@repo/shared`.
- **Prisma Client (`apps/api`):** Generated into `apps/api/src/generated/prisma` (gitignored) and imported via `@/generated/prisma/client.js`.
- **Test location:** All packages (`apps/api`, `apps/web`, `packages/shared`) keep their test files in a dedicated `tests/` directory outside `src/`.

### API-First Workflow with `@repo/shared`

To prevent contract drift between frontend and backend developers:

1. **Define or update Zod schemas** in `packages/shared/src/schemas/` (and add schema tests in `packages/shared/tests/schemas/`).
2. **Register the endpoint** in `apps/api/src/docs/openapi.ts` and run `pnpm docs:generate`.
3. **Implement the backend route** in `apps/api/src/routes/` importing the schema from `@repo/shared`.
4. **Consume the schema/types on the frontend** in `apps/web/src/` by importing from `@repo/shared`.

---

## 5. Git Branch Naming Policy (Enforced)

Every branch (except `main` and `develop`) **must** follow the pattern:

```text
<type>/<scope>/<short-kebab-description>
```

- **Allowed `<type>`:** `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `ci`, `perf`
- **Allowed `<scope>`:** `api`, `web`, `shared`, `docs`, `repo`
- **Description:** lowercase letters, numbers, and hyphens only (`[a-z0-9-]+`)

### Valid Branch Examples

- `feat/api/auth-refresh-token`
- `fix/web/user-profile-query`
- `feat/web/mobile-navigation`
- `fix/web/login-form-validation`
- `chore/shared/update-zod-schemas`

> **Note:** Both the local Husky `pre-commit` hook (`scripts/validate-git.mjs`) and GitHub Actions CI will reject commits or PRs from branches that do not match this format.

---

## 6. Commit Message Convention (Enforced via `commitlint`)

All commit messages must follow Conventional Commits with a **mandatory scope**:

```text
<type>(<scope>): <lowercase concise description>
```

- **Allowed `<type>`:** `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`, `perf`, `revert`
- **Allowed `<scope>`:** `api`, `web`, `shared`, `docs`, `repo`, `ci`

### Valid Commit Examples

- `feat(api): implement jwt refresh endpoint`
- `fix(web): adjust padding for mobile breakpoint in header`
- `docs(api): add password reset route to openapi spec`
- `feat(shared): export user role enum and validation schema`

---

## 7. Atomic Scope & Pull Request Rules (Enforced)

1. **Do Not Mix `api` and `web` in Feature Commits or PRs:**
   - Local `pre-commit` hooks block commits that stage files in both `apps/api/` and `apps/web/` unless you are on a repository-wide `<type>/repo/<description>` branch (e.g., `feat/repo/initial-monorepo-setup`).
   - GitHub Actions CI (`pr-policy`) blocks Pull Requests that touch both `apps/api/` and `apps/web/` unless the branch uses the `/repo/` scope or a lead attaches the `allow-cross-scope` label.
2. **Order of Merging for Full-Stack Features:**
   - **Step 1:** Open and merge a `shared` PR (or include `packages/shared` with the initial contract).
   - **Step 2:** Open separate `api` and `web` PRs in parallel against the shared contract.
3. **Code Owners & Reviews (`.github/CODEOWNERS`):**
   - PRs modifying `apps/api/` are automatically routed to backend reviewers.
   - PRs modifying `apps/web/` are automatically routed to frontend reviewers.
   - PRs modifying `packages/shared/` require approval from both backend and frontend leads.

---

## 8. Hosting & Free-Tier Deployment Targets

| Service                   | Target Platform            | Notes                                                                                                                                              |
| ------------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend (`apps/web`)** | **Vercel**                 | Configured via root `vercel.json` (`pnpm build:web` -> `apps/web/dist`) and `apps/web/vercel.json`. Set `VITE_API_URL` in Vercel env vars.         |
| **Backend (`apps/api`)**  | **Render**                 | Configured via `render.yaml` and multi-stage `Dockerfile` (runs `db:migrate:deploy` during build, starts `node dist/server.js`). Check: `/healthz` |
| **Database**              | **Neon.tech (PostgreSQL)** | Configure both `DATABASE_URL` (pooled with `?pgbouncer=true`) and `DIRECT_URL` (direct connection for Prisma migrations).                          |
| **API Docs**              | **GitHub Pages & Local**   | Runtime Swagger UI at `/api-docs`; static Redocly bundle deployed automatically via `.github/workflows/deploy-docs.yml`.                           |
