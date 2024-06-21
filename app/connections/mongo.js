const _ = require('lodash');
const mongoose = require('mongoose');
const config = require('../fdk/config');
const logger = require('../utils/logger');

const options = {
  readPreference: 'secondaryPreferred',
  keepAlive: true,
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,
};

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set(
  'useUnifiedTopology',
  !['development'].includes(config.env) // true for production
);

const mConnections = {};

/**
 * Connect to MongoDB
 * @param {string} name
 * @param {string} uri
 * @returns {mongoose.Connection}
 */
function createConnection(name, uri) {
  logger.debug(uri);
  console.time('mongodb connection time');
  const db = mongoose.createConnection(uri, options);

  db.then(() => {}).catch(err => {
    console.error(err);
  });

  db.on('connected', () => {
    console.timeLog('mongodb connection time');
    logger.info(`MongoDB ${name} connected`);
  });

  db.on('disconnected', () => {
    logger.warn(`MongoDB ${name} disconnected`);
  });

  db.on('reconnected', () => {
    logger.info(`MongoDB ${name} reconnected`);
  });

  db.on('error', err => {
    logger.error(`Error connection MongoDB ${name}`);
    console.error(err);
    // If first connect fails because mongod is down, try again later.
    // This is only needed for first connect, not for runtime reconnects.
    // See: https://github.com/Automattic/mongoose/issues/5169
    // Wait for a bit, then try to connect again

    // [PNC]: removed the if clause to retry on every connection error
    setTimeout(() => {
      logger.info(`Retrying first connect for MongoDB ${name}...`);
      db.openUri(uri).catch(() => {});
      // Why the empty catch?
      // Well, errors thrown by db.open() will also be passed to .on('error'),
      // so we can handle them there, no need to log anything in the catch here.
      // But we still need this empty catch to avoid unhandled rejections.
    }, 5 * 1000);
  });

  db.on('reconnectFailed', () => {
    logger.info(`MongoDB ${name} reconnectFailed`);
  });

  return db;
}

_.forEach(config.mongo, (m, key) => {
  const { uri } = m;
  mConnections[key] = createConnection(key, uri);
  //   mongoose.createConnection(uri, opt);
});

module.exports = mConnections;
