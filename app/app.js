const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const Sentry = require('./connections/sentry');
const { errorHandler } = require('./middlewares');
const rootRouter = require('./routes/root');

const app = express();

app.use(Sentry.Handlers.requestHandler());
app.use(morgan('dev'));
app.use(cookieParser('ext.session'));
app.use(bodyParser.json({ limit: '2mb' }));
app.use('/', rootRouter);

const API = require('./routes');

console.log('registering');
API.registerRoutes(app);

// Error handlers
app.use(Sentry.Handlers.errorHandler());
app.use(errorHandler);

process.on('unhandledRejection', err => {
  Sentry.captureException(err);
});

module.exports = app;
