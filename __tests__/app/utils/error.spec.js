const {
  AppError,
  BadRequest,
  UnauthorizedRequest,
  ForbiddenRequest,
  NotFound,
  UnprocessableEntity,
} = require('../../../app/utils/error');

describe('Error Utilities test Suite', () => {
  it('AppError sets the correct message and statusCode', () => {
    const errorMessage = 'General error';
    const error = new AppError(errorMessage);

    expect(error.message).toBe(errorMessage);
    expect(error.statusCode).toBe(500);
  });

  it('BadRequest sets the correct statusCode', () => {
    const error = new BadRequest('Bad request error');
    expect(error.statusCode).toBe(400);
  });

  it('UnauthorizedRequest sets the correct statusCode', () => {
    const error = new UnauthorizedRequest('Unauthorized error');
    expect(error.statusCode).toBe(401);
  });

  it('ForbiddenRequest sets the correct statusCode', () => {
    const error = new ForbiddenRequest('Forbidden error');
    expect(error.statusCode).toBe(403);
  });

  it('NotFound sets the correct statusCode', () => {
    const error = new NotFound('Not found error');
    expect(error.statusCode).toBe(404);
  });

  it('UnprocessableEntity sets the correct statusCode', () => {
    const error = new UnprocessableEntity('Unprocessable entity error');
    expect(error.statusCode).toBe(422);
  });
});
