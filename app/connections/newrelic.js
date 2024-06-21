const config = require('../fdk/config');
const logger = require('../utils/logger');

if (config.newrelic.app_name && config.newrelic.license_key) {
  logger.info('Loading newrelic npm package now');
  // eslint-disable-next-line global-require
  require('newrelic');
} else {
  logger.warn('Newrelic configuration not found');
}
