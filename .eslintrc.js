module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  env: {
    node: true,
    es6: true,
    mocha: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2016,
    sourceType: 'module',
    babelOptions: {
      plugins: ['@babel/plugin-proposal-class-properties'],
    },
  },
  plugins: ['prettier', '@typescript-eslint'],
  rules: {
    'prettier/prettier': ['error', { singleQuote: true }],
    quotes: ['error', 'single'],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-function': 'off',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
