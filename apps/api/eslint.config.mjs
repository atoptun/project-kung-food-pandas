import { defineConfig } from 'eslint/config';
import globals from 'globals';

import { baseEslintConfig } from '../../eslint.config.mjs';

export default defineConfig([
  ...baseEslintConfig,
  {
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 2024,
      globals: {
        ...globals.node,
      },
    },
  },
]);
