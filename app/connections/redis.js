const Redis = require('ioredis');
const config = require('../fdk/config');
const logger = require('../utils/logger');

function connect(name, uri) {
  const db = new Redis(uri, {
    reconnectOnError(err) {
      const targetError = 'EAI_AGAIN';
      if (err.message.includes(targetError)) {
        return true;
      }
      return false;
    },
  });
  db.on('connect', () => {
    logger.info(`Redis ${name} connected.`);
  });
  db.on('ready', () => {
    logger.info(`Redis ${name} is ready`);
  });
  db.on('error', () => {
    logger.info(`Redis ${name} got error`);
  });
  db.on('close', () => {
    logger.info(`Redis ${name} is closed`);
  });
  db.on('reconnecting', () => {
    logger.info(`Redis ${name} got error`);
  });
  db.on('reconnecting', () => {
    logger.info(`Redis ${name} is ended`);
  });
  return db;
}

const hostRedis = connect('Host Read Write', config.redis.host);

module.exports = { appRedis: hostRedis };
