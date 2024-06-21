const { catchAsync, errorHandler } = require('../../../app/middlewares');

describe('catchAsync utility', () => {
  it('forwards an error to next middleware if the wrapped function rejects', async () => {
    const mockError = new Error('Test error');
    const mockAsyncFunction = jest.fn().mockRejectedValue(mockError);
    const mockReq = {};
    const mockRes = {};
    const mockNext = jest.fn();

    const wrappedFunction = catchAsync(mockAsyncFunction);
    await wrappedFunction(mockReq, mockRes, mockNext);

    expect(mockAsyncFunction).toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledWith(mockError);
  });
});

describe('errorHandler middleware', () => {
  it('responds with the correct status and message for a custom error', () => {
    const mockError = { statusCode: 404, message: 'Not found' };
    const mockReq = {};
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    const mockNext = jest.fn();

    errorHandler(mockError, mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Not found' });
  });
});
