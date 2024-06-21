const config = require('../fdk/config');
const logger = require('../utils/logger');
const { AppError } = require('../utils/error');

module.exports = function (err, req, res) {
  // err = err || {};
  let statusCode = 500;

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  if (['ValidationError', 'CastError'].includes(err.name)) {
    statusCode = 400;
  }

  if (err.statusCode) {
    statusCode = err.statusCode;
  }

  const errorBody = {
    message: err.errors || err.message || err,
    code: err.code,
    sentry: res.sentry,
  };

  if (['fyndx0'].includes(config.environment)) {
    errorBody.stack = err.stack;
    logger.debug(err);
  }
  return res.status(statusCode).json(errorBody);
};
