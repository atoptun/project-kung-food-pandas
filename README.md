# Foodies (Kung Food Pandas)

<div align="center">
    <img src="./apps/web/public/favicon.svg" alt="Kung Food Pandas Logo" width="96" height="96" />
    <br />
    <br />
    <a href="https://project-kung-food-pandas.vercel.app/">
      <img src="https://img.shields.io/badge/Live_Demo-Visit_Site-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
    </a>
</div>

A full-stack culinary community platform for discovering, creating, and sharing recipes. Built as a high-performance TypeScript monorepo with Express, React 19, StyleX, PostgreSQL, and Better Auth.

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D24.0.0-brightgreen.svg)](https://nodejs.org/) [![pnpm Version](https://img.shields.io/badge/pnpm-%3E%3D10.0.0-orange.svg)](https://pnpm.io/) [![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)](https://www.typescriptlang.org/) [![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/) [![Turborepo](https://img.shields.io/badge/Turborepo-cached-ef4444.svg)](https://turbo.build/)

---

## Features

- **Interactive Recipe Discovery:** Filter recipes by category, ingredient, area, or popularity with responsive grid and list layouts.
- **Recipe Management:** Create, customize, and publish recipes with dynamic ingredient counters, step-by-step instructions, and image uploads.
- **User Profiles & Collections:** Manage personal recipes, track favorites, view follower/following activity, and update avatars.
- **Modern Authentication:** Secure session-based authentication (Better Auth) with modal sign-in/sign-up flows and protected route guards.
- **Cloud Media Uploads:** Automated image processing and hosting powered by Cloudinary.
- **Comprehensive API Documentation:** OpenAPI 3.0 specification generated directly from Zod contracts, served with interactive Swagger UI and Redoc.

---

## 🔗 Project Resources

| Resource             | Description                                                                    | Link                                                                                                          |
| :------------------- | :----------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------ |
| 🚀 **Live Demo**     | Production web application deployed on Vercel                                  | [project-kung-food-pandas.vercel.app](https://project-kung-food-pandas.vercel.app/)                           |
| 🎨 **Figma Design**  | UI/UX layouts, responsive breakpoints & design system specs                    | [Open in Figma](https://www.figma.com/design/bWQKWe0sZ3LnmcnEwXGbHv/Foodies?node-id=0-1&t=xwbD1G7xNX5FXEjz-1) |
| 📊 **Presentation**  | Project slide deck, key architectural highlights & team overview               | [View Presentation (PDF)](<./docs/Kung Food Panda.pdf>)                                                       |
| 🖼️ **UI Showcase**   | Complete visual gallery of application screens across Desktop, Tablet & Mobile | [View Screenshots](./docs/SCREENSHOTS.md)                                                                     |
| 📖 **API Docs**      | Interactive OpenAPI 3.0 specification & live testing sandbox                   | [Swagger UI](https://project-kung-food-pandas.onrender.com/api-docs/)                                         |
| 📋 **Project Board** | GitHub Projects kanban board tracking tasks, sprints & milestones              | [GitHub Project Board](https://github.com/users/atoptun/projects/4)                                           |

---

## Architecture & Monorepo Structure

```text
.
├── apps/
│   ├── api/          # Express REST API (Node 24, Prisma ORM, Better Auth, Cloudinary)
│   └── web/          # React 19 SPA (Vite, React Router v7, StyleX, TanStack Query)
├── packages/
│   ├── shared/       # Shared Zod validation schemas & TypeScript DTO contracts
│   └── typescript-config/ # Base tsconfig presets across workspaces
└── docker/           # PostgreSQL container configs and DB initialization scripts
```

### Tech Stack

| Domain                 | Technologies                                                                                                                                                                                                                                                             |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Monorepo & Build**   | [Turborepo](https://turbo.build/), [pnpm Workspaces](https://pnpm.io/workspaces), [Node.js 24 LTS](https://nodejs.org/)                                                                                                                                                  |
| **Backend API**        | [Express 5](https://expressjs.com/), [Prisma ORM 7](https://www.prisma.io/), [Better Auth](https://www.better-auth.com/), [Pino](https://getpino.io/), [Zod 4](https://zod.dev/)                                                                                         |
| **Frontend Web**       | [React 19](https://react.dev/), [Vite](https://vite.dev/), [React Router](https://reactrouter.com/), [@stylexjs/stylex](https://stylexjs.com/), [TanStack Query](https://tanstack.com/query), [Zustand](https://github.com/pmndrs/zustand)                               |
| **Database & Storage** | [PostgreSQL 18](https://www.postgresql.org/), [Cloudinary](https://cloudinary.com/)                                                                                                                                                                                      |
| **Testing & Quality**  | [Vitest](https://vitest.dev/), [React Testing Library](https://testing-library.com/), [MSW](https://mswjs.io/), [Supertest](https://github.com/ladjs/supertest), [ESLint](https://eslint.org/), [Prettier](https://prettier.io/), [Storybook](https://storybook.js.org/) |

---

## Prerequisites

Before starting, ensure you have the following installed locally:

- **Node.js**: `>= 24.0.0` (managed via `.nvmrc`)
- **pnpm**: `>= 10.0.0`
- **Docker**: For running the local PostgreSQL service

---

## Quick Start

### 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd project-kung-food-pandas
pnpm install
```

### 2. Configure Environment Variables

Create your local environment configuration file:

```bash
cp .env.template .env.local
```

> [!NOTE]
> Review `.env.local` to customize database credentials, backend ports, and Cloudinary keys if needed. Defaults are preconfigured for local Docker development.

### 3. Start Database & Run Migrations

Start the PostgreSQL service in Docker and prepare the Prisma client:

```bash
# Start PostgreSQL container
pnpm db:up

# Generate Prisma client and apply migrations
pnpm db:generate
pnpm db:migrate

# (Optional) Seed sample categories and data
pnpm --filter @repo/api db:seed
```

### 4. Run the Development Servers

Start all applications (API + Web) concurrently using Turborepo:

```bash
pnpm dev
```

Once running, the services will be available at:

- **Frontend App:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:4000](http://localhost:4000)
- **Interactive API Docs (Swagger):** [http://localhost:4000/api-docs](http://localhost:4000/api-docs)
- **Health Checks:** [http://localhost:4000/healthz](http://localhost:4000/healthz) & [http://localhost:4000/readyz](http://localhost:4000/readyz)

---

## Common Scripts

The root `package.json` provides scripts to manage the entire monorepo:

### Development & Build

| Command              | Description                                       |
| -------------------- | ------------------------------------------------- |
| `pnpm dev`           | Starts all applications in watch/development mode |
| `pnpm dev:api`       | Starts only the backend API server                |
| `pnpm dev:web`       | Starts only the Vite frontend dev server          |
| `pnpm build`         | Builds all packages and applications              |
| `pnpm storybook:web` | Starts Storybook for frontend UI components       |

### Database Management

| Command            | Description                                            |
| ------------------ | ------------------------------------------------------ |
| `pnpm db:up`       | Boots the local PostgreSQL container in the background |
| `pnpm db:down`     | Stops and removes the PostgreSQL container             |
| `pnpm db:generate` | Generates the Prisma Client                            |
| `pnpm db:migrate`  | Runs database migrations in development                |
| `pnpm db:studio`   | Opens Prisma Studio GUI to inspect database records    |

### Quality & Testing

| Command             | Description                                                    |
| ------------------- | -------------------------------------------------------------- |
| `pnpm test`         | Runs all unit and integration test suites via Vitest           |
| `pnpm typecheck`    | Validates TypeScript types across all workspaces               |
| `pnpm lint`         | Runs ESLint across all projects                                |
| `pnpm lint:fix`     | Automatically fixes ESLint issues where possible               |
| `pnpm format:check` | Verifies code formatting with Prettier                         |
| `pnpm check`        | Full pipeline verification (format, lint, types, tests, build) |

### API Documentation

| Command              | Description                                              |
| -------------------- | -------------------------------------------------------- |
| `pnpm docs:generate` | Generates the OpenAPI 3.0 specification from Zod schemas |
| `pnpm docs:lint`     | Validates the OpenAPI specification with Redocly CLI     |
| `pnpm docs:build`    | Compiles a standalone HTML documentation bundle          |
| `pnpm docs:preview`  | Builds and previews the Redoc documentation locally      |

---

## Deployment

The platform is designed for straightforward deployment across cloud platforms:

- **Frontend (`apps/web`):** Configured for [Vercel](https://vercel.com/) via root [`vercel.json`](./vercel.json).
- **Backend API (`apps/api`):** Configured for [Render](https://render.com/) via [`render.yaml`](./render.yaml) or standalone containerization using the root [`Dockerfile`](./Dockerfile).
- **Production Database:** Compatible with pooled PostgreSQL instances (e.g., [Neon](https://neon.tech/)) using separate connection URLs (`DATABASE_URL` with PgBouncer and direct `DIRECT_URL` for migrations).
