const config = require('./fdk/config');
const logger = require('./utils/logger');
// Init
const mongo = require('./connections/mongo');
require('./connections/newrelic');
require('./connections/sentry');

let server;

const onServerInit = function () {
  logger.info(
    `Host server listening on port http://localhost:${config.port} !`
  );
};

const onDestroy = async function (e) {
  logger.info(`${e} signal received`);
  logger.info('Closing http server.');
  await Promise.all([mongo.host.client.close()]);
  server.close(() => {
    logger.info('Http server closed.');
    process.exit(0);
  });
};

const app = require('./app');

server = app.listen(config.port, onServerInit);

process.on('SIGTERM', onDestroy);
process.on('SIGINT', onDestroy);

module.exports = app;
