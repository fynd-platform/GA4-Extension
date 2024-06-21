const errorRoutes = require('./errorHandler');

module.exports = {
  catchAsync: fn => (req, res, next) => {
    fn(req, res, next).catch(next);
  },
  errorHandler: errorRoutes,
};
