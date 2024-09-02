const { setupFdk } = require('fdk-extension-javascript/express');
const extensionHandler = require('./extension_handler');
const config = require('./config');
const { MongoDBStorage } = require('../connections/mongo_storage');
const { SessionModel } = require('../models/Session');

const baseUrl = config.BROWSER_CONFIG.HOST_MAIN_URL;

const FDKExtension = setupFdk({
  api_key: config.extension.api_key || config.API_KEY,
  api_secret: config.extension.api_secret || config.API_SECRET,
  cluster: config.cluster_url,
  base_url: baseUrl,
  callbacks: extensionHandler,
  storage: new MongoDBStorage(SessionModel, config.get('extension.app_name')),
  access_mode: 'offline',
});

/**
 * Initializes and returns an FDK extension instance asynchronously.
 * This setup is specifically configured for use with MongoDB for session storage.
 *
 * @returns {Promise<Object>} A promise that resolves to the FDK extension instance.
 */
const getFdkAsync = () =>
  setupFdk(
    {
      api_key: config.extension.api_key || config.API_KEY,
      api_secret: config.extension.api_secret || config.API_SECRET,
      cluster: config.cluster_url,
      base_url: baseUrl,
      callbacks: extensionHandler,
      storage: new MongoDBStorage(
        SessionModel,
        config.get('extension.app_name')
      ),
      access_mode: 'offline',
    },
    true
  );

module.exports = {
  FDKExtension,
  getFdkAsync,
};
