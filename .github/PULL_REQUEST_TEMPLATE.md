## Summary

<!-- Describe what this PR changes and why -->

## Scope

- [ ] `api` (`apps/api`)
- [ ] `web` (`apps/web`)
- [ ] `shared` (`packages/shared`)
- [ ] `docs` / `repo`

## Checklist

- [ ] Branch name follows `<type>/<scope>/<short-kebab-description>`
- [ ] PR does **not** mix `apps/api` and `apps/web` changes
- [ ] Shared Zod schemas and OpenAPI documentation (`pnpm docs:generate`) are updated if API contracts changed
- [ ] `pnpm lint`, `pnpm typecheck`, and `pnpm test` pass locally
