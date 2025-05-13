import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default defineConfig([
  {
    ignores: ['**/*.js', 'node_modules/', 'dist/'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    plugins: { js },
    extends: ['js/recommended'],
  },
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  {
    files: ['**/*.{js,ts,mjs,cjs}'],
    plugins: { prettier: prettierPlugin },
    rules: {
      'prettier/prettier': 'error',
    },
    extends: [prettierConfig],
  },
]);
