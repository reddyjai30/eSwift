import ApiError from '../utils/ApiError.js'

export function errorHandler(err, _req, res, _next) {
  const status = err.statusCode || 500
  const payload = { success: false, message: err.message || 'Internal Server Error', ...(err.details ? { details: err.details } : {}) }
  if (process.env.NODE_ENV !== 'production') console.error(err)
  res.status(status).json(payload)
}

export function notFound(_req, _res, next){ next(ApiError.notFound('Route not found')) }

