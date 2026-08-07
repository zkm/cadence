const js = require('@eslint/js');
const vue = require('eslint-plugin-vue');
const vueParser = require('vue-eslint-parser');
const globals = require('globals');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  {
    ignores: ['node_modules', 'dist', '.yarn'],
  },
  {
    files: ['**/*.js', '**/*.cjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'warn',
    },
  },
  ...vue.configs['flat/recommended'].map((config) => ({
    ...config,
    files: ['**/*.vue'],
  })),
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'warn',
      'vue/multi-word-component-names': 'off',
    },
  },
  prettierConfig,
];
