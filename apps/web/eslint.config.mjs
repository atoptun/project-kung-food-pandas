import stylex from '@stylexjs/eslint-plugin';
import { defineConfig } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

import { baseEslintConfig } from '../../eslint.config.mjs';

export default defineConfig([
  ...baseEslintConfig,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2024,
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      '@stylexjs': stylex,
      'react-hooks': reactHooks,
    },
    rules: {
      '@stylexjs/valid-styles': 'error',
      '@stylexjs/no-conflicting-props': 'error',
      ...reactHooks.configs.recommended.rules,
    },
  },
]);
