const request = require('supertest');
const express = require('express');
const router = require('../../../app/routes/root');

const healthCheck = require('../../../app/health_check');

jest.mock('../../../app/health_check');

const config = require('../../../app/fdk/config');

healthCheck.checkHealth.mockImplementation((req, res) => {
  res.json({ ok: true });
});

jest.mock('../../../app/fdk/config', () => ({
  sentry: 'test-sentry-dsn',
  env: 'test',
  BROWSER_CONFIG: {
    apiBaseUrl: 'https://api.example.com',
  },
  redis: {
    host: 'mockedHostValue',
  },
}));

jest.mock('../../../app/connections/redis.js', () => ({
  appRedis: {
    on: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
  },
}));

const app = express();
app.use(router);

describe('Health Check Routes test suite', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test.each(['/_livez', '/_healthz', '/_readyz'])(
    'GET %s responds with 200 status and correct body',
    async path => {
      const response = await request(app).get(path);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ ok: true });
    }
  );

  test('GET /_livez responds with 500 status on failure', async () => {
    healthCheck.checkHealth.mockImplementationOnce((req, res) => {
      res.status(500).json({ ok: false, message: 'Health check failed' });
    });
    const response = await request(app).get('/_livez');
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      ok: false,
      message: 'Health check failed',
    });
  });

  test.each(['/hi', '/hello'])(
    'GET %s responds with correct message',
    async path => {
      const response = await request(app).get(path);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        version: expect.any(String),
        title: expect.any(String),
        decription: expect.any(String),
        message: 'Welcome to GA4 Extension',
      });
    }
  );

  test('responds with correct content type and configuration script', async () => {
    const response = await request(app).get('/env.js');

    expect(response.headers['content-type']).toEqual(
      expect.stringContaining('application/javascript')
    );

    const expectedConfigScript = `window.env = ${JSON.stringify(
      { ...config.BROWSER_CONFIG, sentry: config.sentry, env: config.env },
      null,
      4
    )}`;
    expect(response.text).toEqual(expectedConfigScript);
  });
});
