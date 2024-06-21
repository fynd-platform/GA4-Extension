jest.mock('../../../app/fdk/config', () => ({
  environment: 'test',
}));

jest.mock('../../../app/utils/logger', () => ({
  debug: jest.fn(),
}));

jest.mock('../../../app/utils/error', () => ({
  AppError: class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
    }
  },
}));

const errorHandlerMiddleware = require('../../../app/middlewares/errorHandler');
const { AppError } = require('../../../app/utils/error');

describe('Error Handler Middleware', () => {
  it('should handle AppError correctly', () => {
    const err = new AppError('Not found', 404);
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    errorHandlerMiddleware(err, req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not found' });
  });

  it('should handle ValidationError correctly', () => {
    const err = { name: 'ValidationError', message: 'Invalid input' };
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    errorHandlerMiddleware(err, req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Invalid input' })
    );
  });

  it('should handle generic errors correctly', () => {
    const err = new Error('Something went wrong');
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      sentry: '123',
    };

    errorHandlerMiddleware(err, req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Something went wrong',
        sentry: '123',
      })
    );
  });

  it('should include stack trace in development environment', () => {
    require('../../../app/fdk/config').environment = 'fyndx0';
    const err = new Error('Dev error');
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      sentry: '123',
    };

    errorHandlerMiddleware(err, req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ stack: err.stack })
    );
  });

  it('should use the statusCode from the error if it exists', () => {
    const err = { message: 'Resource not found', statusCode: 404 };
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    errorHandlerMiddleware(err, req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Resource not found',
    });
  });
});
