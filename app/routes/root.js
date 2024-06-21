const path = require('path');
const express = require('express');

const router = express.Router();
const packageJson = require('../../package.json');
const { checkHealth } = require('../health_check');
const config = require('../fdk/config');

router.get(['/_livez', '/_healthz', '/_readyz'], checkHealth);

router.use(['/hi', '/hello'], (req, res) =>
  res.json({
    version: packageJson.version,
    title: packageJson.name,
    decription: packageJson.description,
    message: 'Welcome to GA4 Extension',
  })
);

if (config.env === 'development') {
  router.use(
    '/coverage',
    express.static(path.join(__dirname, '../../coverage/lcov-report'))
  );
}

router.get('/env.js', (req, res) => {
  res.type('application/javascript');
  const commonEnvs = {
    sentry: config.sentry,
    env: config.env,
  };
  res.send(
    `window.env = ${JSON.stringify(
      { ...config.BROWSER_CONFIG, ...commonEnvs },
      null,
      4
    )}`
  );
});

module.exports = router;
