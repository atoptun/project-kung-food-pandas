import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  // tsup injects `baseUrl` internally when building `.d.ts` via TypeScript 6
  dts: {
    compilerOptions: {
      ignoreDeprecations: '6.0',
    },
  },
  clean: true,
  sourcemap: true,
});
