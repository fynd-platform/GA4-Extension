// const path = require('path');
const _ = require('lodash');
const mongoose = require('mongoose');
const promFileClient = require('prom-file-client');
const mongoConnections = require('../connections/mongo');
const redis = require('../connections/redis');
const config = require('../fdk/config');

let logErrorCounter = {
  labels: () => ({ inc: () => {} }),
};

function startPrometheus() {
  const prometheusClient = promFileClient.prometheus;
  const prometheusRegister = promFileClient.fileRegistry.getInstance({
    metricsDir: config.metrics_dir,
  });
  const labelEnum = {
    type: 'type', // type of db/service
    name: 'name', // name of db/service
  };

  // TODO: verify if its valid
  const computedLogErrorCounter = new prometheusClient.Counter({
    name: 'newsletter_ext_error_log_event',
    help: 'Event produced when error log is created',
    labelNames: [labelEnum.type, labelEnum.name],
    register: prometheusRegister,
  });
  return computedLogErrorCounter;
}

// prometheus
if (!['development', 'test'].includes(config.env)) {
  logErrorCounter = startPrometheus();
}

function checkMongoConnection(connection) {
  if (!connection) {
    return true;
  }
  const dbStatus = connection.readyState;
  if (dbStatus !== mongoose.Connection.STATES.connected) {
    logErrorCounter.labels('mongodb', connection.name).inc();
    return false;
  }
  return true;
}

async function checkRedisConnection(connection, name) {
  return new Promise((resolve, reject) => {
    connection.ping((err, result) => {
      if (result !== 'PONG' || err) {
        logErrorCounter.labels('redis', name).inc();
        reject();
      }
      resolve();
    });
  });
}

async function checkHealth(req, res) {
  try {
    // mongo
    const mongoKeys = _.keys(mongoConnections);
    mongoKeys.forEach(key => {
      if (!checkMongoConnection(mongoConnections[key])) {
        throw new Error('Host mongo not connected');
      }
    });

    // redis
    await Promise.all([checkRedisConnection(redis.appRedis)]);

    return res.json({ ok: true });
  } catch (error) {
    const message = (error && error.message) || 'Health check failed';
    return res.status(500).json({ ok: false, message });
  }
}

module.exports = {
  checkHealth,
};
