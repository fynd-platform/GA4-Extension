/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */

class AppError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
  }

  get statusCode() {
    return 500;
  }
}

class BadRequest extends AppError {
  get statusCode() {
    return 400;
  }
}
class UnauthorizedRequest extends AppError {
  get statusCode() {
    return 401;
  }
}

class ForbiddenRequest extends AppError {
  get statusCode() {
    return 403;
  }
}
class NotFound extends AppError {
  get statusCode() {
    return 404;
  }
}
class UnprocessableEntity extends AppError {
  get statusCode() {
    return 422;
  }
}

module.exports = {
  AppError,
  BadRequest,
  UnauthorizedRequest,
  ForbiddenRequest,
  NotFound,
  UnprocessableEntity,
};

/* eslint-enable max-classes-per-file */
/* eslint-enable class-methods-use-this */
