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

## Documentation & Collaboration

Please read **[CONTRIBUTING.md](./CONTRIBUTING.md)** for branch naming rules, commit message conventions, PR scope isolation, and common commands.
