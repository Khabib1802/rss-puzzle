module.exports = {
  root: true,

  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },

  plugins: ['@typescript-eslint', 'import'],

  extends: ['airbnb-base', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended', 'prettier'],

  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
    },
  },

  noInlineConfig: true,
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    'no-magic-numbers': 'error',
    'max-lines-per-function': ['error', 40],
  },
};
