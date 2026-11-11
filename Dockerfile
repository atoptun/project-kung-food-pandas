# ==============================================================================
# Stage 1: Base image with Node 24 & pnpm via Corepack
# ==============================================================================
FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# ==============================================================================
# Stage 2: Install dependencies & build @repo/shared + @repo/api
# ==============================================================================
FROM base AS builder

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY packages/shared/package.json ./packages/shared/package.json
COPY packages/typescript-config/package.json ./packages/typescript-config/package.json

# Install all dependencies required to build @repo/api and its workspace dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --prod=false --filter @repo/api...

# Copy source files for shared packages and backend API (excluding apps/web)
COPY packages/typescript-config ./packages/typescript-config
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

# Build @repo/shared, generate Prisma client, generate OpenAPI spec, and bundle @repo/api
RUN pnpm build:api

# Apply production database migrations during build when DB credentials are provided (e.g. on Render)
ARG DATABASE_URL
ARG DIRECT_URL
RUN if [ -n "$DIRECT_URL" ] || [ -n "$DATABASE_URL" ]; then \
      pnpm --filter @repo/api db:migrate:deploy && \
      pnpm --filter @repo/api db:seed; \
    fi

# Create isolated production deployment with only production dependencies
RUN pnpm --filter @repo/api --prod deploy --legacy /prod/api

# ==============================================================================
# Stage 3: Minimal Production Runner
# ==============================================================================
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

USER node

COPY --from=builder --chown=node:node /prod/api/package.json ./package.json
COPY --from=builder --chown=node:node /prod/api/node_modules ./node_modules
COPY --from=builder --chown=node:node /prod/api/dist ./dist
COPY --from=builder --chown=node:node /prod/api/openapi.yaml ./openapi.yaml

EXPOSE 4000

CMD ["node", "dist/server.js"]
