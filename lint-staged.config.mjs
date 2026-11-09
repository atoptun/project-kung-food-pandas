export default {
  'apps/web/**/*.{ts,tsx,js,jsx}': [
    'pnpm --filter=@repo/web exec eslint --fix',
    'prettier --write',
  ],
  'apps/api/**/*.ts': ['pnpm --filter=@repo/api exec eslint --fix', 'prettier --write'],
  'packages/shared/**/*.ts': ['pnpm --filter=@repo/shared exec eslint --fix', 'prettier --write'],
  '*.{js,mjs,cjs}': ['eslint --fix', 'prettier --write'],
  'apps/api/openapi*.{yaml,yml}': () => 'pnpm --filter=@repo/api exec redocly lint openapi.yaml',
  '*.{json,md,yml,yaml,css}': ['prettier --write'],
};
