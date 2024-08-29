const _ = require('lodash');
const convict = require('convict');
const mongodbUri = require('mongodb-uri');

convict.addFormat({
  name: 'mongo-uri',
  validate(val) {
    const parsed = mongodbUri.parse(val);
    mongodbUri.format(parsed);
  },
  coerce(urlString) {
    let parsedUrlString;
    if (urlString) {
      const parsed = mongodbUri.parse(urlString);
      parsedUrlString = mongodbUri.format(parsed);
    }
    return parsedUrlString;
  },
});

const config = convict({
  env: {
    doc: 'node env',
    format: String,
    default: 'development',
    env: 'NODE_ENV',
    arg: 'node_env',
  },
  environment: {
    doc: 'env',
    format: String,
    default: 'fyndx0',
    env: 'ENV',
    arg: 'env',
  },
  image: {
    doc: 'k8s image',
    format: String,
    default: '',
    env: 'IMAGE',
    arg: 'image',
  },
  mongo: {
    host: {
      uri: {
        doc: 'host mongo',
        format: 'mongo-uri',
        default: 'mongodb://localhost:27017/ga4',
        env: 'MONGO_GA4_READ_WRITE',
        arg: 'mongo_ga4_read_write',
      },
      options: {
        appname: {
          doc: 'mongo app name',
          format: String,
          default: 'ga4',
          env: 'K8S_POD_NAME',
          arg: 'k8s_pod_name',
        },
      },
    },
  },
  redis: {
    host: {
      doc: 'Redis URL of host.',
      format: String,
      default: 'redis://localhost:6379/0',
      env: 'REDIS_EXTENSIONS_READ_WRITE',
      arg: 'redis_extensions_read_write',
    },
  },
  sentry: {
    dsn: {
      doc: 'sentry url',
      format: String,
      default: '',
      env: 'SENTRY_DSN',
      arg: 'sentry_dsn',
    },
    environment: {
      doc: 'sentry environment',
      format: String,
      default: 'development',
      env: 'SENTRY_ENVIRONMENT',
      arg: 'sentry_environment',
    },
  },
  newrelic: {
    app_name: {
      doc: 'new relic app name',
      format: String,
      default: '',
      env: 'NEW_RELIC_APP_NAME',
      arg: 'new_relic_app_name',
    },
    license_key: {
      doc: 'new relic license key',
      format: String,
      default: '',
      env: 'NEW_RELIC_LICENSE_KEY',
      args: 'new_relic_license_key',
    },
  },
  port: {
    doc: 'The port to bind',
    format: 'port',
    default: 5050,
    env: 'PORT',
    arg: 'port',
  },
  log_level: {
    doc: 'log level for logger',
    format: String,
    default: 'info',
    env: 'LOG_LEVEL',
    arg: 'log_level',
  },
  mode: {
    doc: 'app mode',
    format: String,
    default: 'server',
    env: 'MODE',
    arg: 'mode',
  },
  API_KEY: {
    doc: 'Partners API Key',
    format: String,
    default: '',
    env: 'API_KEY',
    arg: 'api_key',
  },
  API_SECRET: {
    doc: 'Partners API Secret',
    format: String,
    default: '',
    env: 'API_SECRET',
    arg: 'api_secret',
  },
  CLUSTER_URL: {
    doc: 'cluster url',
    format: String,
    default: '',
    env: 'CLUSTER_URL',
    arg: 'cluster_url',
  },
  BROWSER_CONFIG: {
    HOST_MAIN_URL: {
      doc: 'Host Main URL',
      format: String,
      default: '',
      env: 'GA4_MAIN_DOMAIN',
      arg: 'ga4_main_domain',
    },
  },
  cluster_url: {
    doc: 'Fynd Platform Domain',
    format: String,
    default: '',
    env: 'EXTENSION_CLUSTER_URL',
    arg: 'extension_cluster_url',
  },
  extension: {
    api_key: {
      doc: 'extension api key',
      default: '',
      env: 'EXTENSION_API_KEY',
    },
    api_secret: {
      doc: 'extension api secret',
      default: '',
      env: 'EXTENSION_API_SECRET',
    },
  },
});

// Perform validation
config.validate({ allowed: 'strict' });

_.extend(config, config.get());

module.exports = config;
