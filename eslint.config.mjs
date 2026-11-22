// Single flat ESLint config for the whole pnpm workspace.
// Each package runs `eslint .`; ESLint discovers this file by walking up
// from the package cwd. Plugins are resolved from the ROOT package.json deps.

import js from '@eslint/js';
import globals from 'globals';
import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/.astro/**',
      '**/.vercel/**',
      '**/coverage/**',
      '**/node_modules/**',
    ],
  },

  // Plain JS config/script files (tailwind.config.js, postcss.config.cjs, …)
  {
    files: ['**/*.{js,mjs,cjs}'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: globals.node,
    },
  },

  // TypeScript (bff + shared-types + any .ts in frontend)
  {
    files: ['**/*.{ts,mts,cts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { ecmaVersion: 2023, sourceType: 'module' },
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { '@typescript-eslint': tseslint.plugin },
    rules: {
      // TS provides its own diagnostics — no-undef is noise there
      'no-undef': 'off',
      // Core correctness from eslint:recommended
      'no-case-declarations': 'error',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-fallthrough': 'error',
      'no-useless-escape': 'error',
      'prefer-const': 'error',
      // TypeScript-eslint core, pragmatic levels for this codebase
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' },
      ],
      // Data-driven pages lean on JSON blobs typed as any — not worth a war
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-empty-function': 'off',
    },
  },

  // Astro components/templates (frontend)
  ...eslintPluginAstro.configs.recommended,
);
