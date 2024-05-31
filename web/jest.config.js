module.exports = {
  displayName: {
    name: 'web',
    color: 'green',
  },
  verbose: true,
  preset: '@vue/cli-plugin-unit-jest',
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.vue$': '@vue/vue3-jest',
  },
  testMatch: ['**/?(*.)+(spec|test).js'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,vue}',
    '!**/node_modules/**',
    '!./src/views/extensions/Details.vue', // Deprecated Application selection page
    '!./src/vue-server.js', // Unused
    '!./src/services/rest/server.engine.js', // Unused
    '!./src/mixins/form.mixin.js', // Unused
  ],
  moduleFileExtensions: ['js', 'json', 'vue'],
  transformIgnorePatterns: ['node_modules/(?!(\\@gofynd/nitrozen-vue)/)'],
};
