import httpStatus from 'http-status'

export default class ApiError extends Error {
  constructor(statusCode, message, details) {
    super(message)
    this.statusCode = statusCode
    this.details = details
  }
  static badRequest(msg='Bad request'){ return new ApiError(httpStatus.BAD_REQUEST, msg) }
  static unauthorized(msg='Unauthorized'){ return new ApiError(httpStatus.UNAUTHORIZED, msg) }
  static forbidden(msg='Forbidden'){ return new ApiError(httpStatus.FORBIDDEN, msg) }
  static notFound(msg='Not found'){ return new ApiError(httpStatus.NOT_FOUND, msg) }
}

