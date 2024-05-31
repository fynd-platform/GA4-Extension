module.exports = {
  root: true, // Indicate this is the root ESLint configuration for the frontend
  env: {
    node: true,
    jest: true, // Ensure ESLint knows to expect Jest globals
  },
  extends: [
    'airbnb-base', // Or your preferred JavaScript style guide
    'plugin:vue/vue3-recommended', // Use vue3-recommended for stricter rules in Vue 3
    '@vue/prettier', // Ensure compatibility with Prettier
  ],
  parserOptions: {
    parser: '@babel/eslint-parser', // Use the latest Babel ESLint Parser
    requireConfigFile: false, // Not requiring a Babel config file
    ecmaVersion: 2021, // Update to a more recent ECMAScript version if needed
    sourceType: 'module', // Support ES Module syntax
  },
  rules: {
    // Customize or override rules here
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/multi-word-component-names': 'off',
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
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './src']],
        extensions: ['.js', '.jsx', '.vue'],
      },
    },
  },
};
