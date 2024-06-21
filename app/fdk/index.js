const { setupFdk } = require('fdk-extension-javascript/express');
const { RedisStorage } = require('fdk-extension-javascript/express/storage');
const extensionHandler = require('./extension_handler');
const config = require('./config');
const { appRedis } = require('../connections/redis');

const baseUrl = config.BROWSER_CONFIG.HOST_MAIN_URL;

const FDKExtension = setupFdk({
  api_key: config.extension.api_key || config.API_KEY,
  api_secret: config.extension.api_secret || config.API_SECRET,
  cluster: config.cluster_url,
  base_url: baseUrl,
  callbacks: extensionHandler,
  storage: new RedisStorage(appRedis, 'ga4'),
  access_mode: 'offline',
});

const getFdkAsync = () =>
  setupFdk(
    {
      api_key: config.extension.api_key || config.API_KEY,
      api_secret: config.extension.api_secret || config.API_SECRET,
      cluster: config.cluster_url,
      base_url: baseUrl,
      callbacks: extensionHandler,
      storage: new RedisStorage(appRedis, 'ga4'),
      access_mode: 'offline',
    },
    true
  );

module.exports = {
  FDKExtension,
  getFdkAsync,
};
