const { createLogger, format, transports } = require('winston');
const config = require('../fdk/config');

const options = {
  level: config.log_level || 'info',
  handleExceptions: true,
  json: true,
  colorize: true,
};

const logger = createLogger({
  level: config.log_level || 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(
      ({ timestamp, level, message, meta }) =>
        `${timestamp} ${level} ${message} ${meta ? JSON.stringify(meta) : ''}`
    ),
    format.colorize()
  ),
  defaultMeta: { service: 'ga4' },
});

if (['development'].includes(config.env)) {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    })
  );
} else {
  logger.add(
    new transports.Console({
      transports: [new transports.Console(options)],
    })
  );
}

module.exports = logger;
