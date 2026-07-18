import { HTTP_STATUS } from '../constants/http-status.js'

export class AppError extends Error {
  constructor(message, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    super(message)

    this.name = this.constructor.name
    this.statusCode = statusCode
    this.isOperational = true

    Error.captureStackTrace?.(this, this.constructor)
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Invalid request') {
    super(message, HTTP_STATUS.BAD_REQUEST)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access') {
    super(message, HTTP_STATUS.UNAUTHORIZED)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, HTTP_STATUS.FORBIDDEN)
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, HTTP_STATUS.NOT_FOUND)
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, HTTP_STATUS.CONFLICT)
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Internal server error') {
    super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR)
  }
}
