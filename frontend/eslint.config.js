import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

/**
 * ESLint Configuration File
 * Used during development to analyze code, enforce best practices,
 * and catch common JavaScript and React syntax errors automatically.
 */
export default defineConfig([
  // 1. GLOBAL IGNORES: Tells ESLint to skip checking built assets in the /dist folder
  globalIgnores(['dist']),

  {
    // 2. TARGET FILES: Apply these code quality rules to all JS and JSX files in the project
    files: ['**/*.{js,jsx}'],

    // 3. RULESETS (EXTENDS):
    // - js.configs.recommended: Core JavaScript best practice rules (e.g., catching unused variables)
    // - reactHooks.configs.flat.recommended: Enforces proper React Hook usage rules (e.g., dependency arrays in useEffect)
    // - reactRefresh.configs.vite: Ensures components support Vite Fast Refresh without losing state during edit
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],

    // 4. LANGUAGE OPTIONS:
    languageOptions: {
      // Defines browser global variables like 'window', 'document', and 'localStorage' so ESLint doesn't flag them as undefined
      globals: globals.browser,

      // Enables JSX syntax parsing for React components
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
])
