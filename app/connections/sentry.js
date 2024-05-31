const Sentry = require('@sentry/node');

const _ = require('lodash');
const packageJson = require('../../package.json');
const config = require('../fdk/config');

const sentryConfig = config.get('sentry');

Sentry.init({
  dsn: sentryConfig.dsn,
  release: packageJson.version,
  environment: sentryConfig.environment,
  enabled: !_.isEmpty(sentryConfig.dsn),
});

module.exports = Sentry;
