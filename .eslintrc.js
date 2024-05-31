module.exports = {
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  // parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
        '**/?(*.)+(spec|test).js',
      ],
      rules: {
        'global-require': 'off',
      },
      env: {
        jest: true,
      },
      plugins: ['jest'],
      extends: ['plugin:jest/recommended'],
    },
  ],
  env: {
    node: true,
    es6: true,
    jest: true,
  },
  globals: {
    window: 'readonly',
    FPI: 'readonly',
    gtag: 'readonly',
  },
};
