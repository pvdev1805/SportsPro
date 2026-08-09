import { HTTP_STATUS } from '../constants/http-status.js'
import normalizeDatabaseError from '../utils/database-error.js'

const errorMiddleware = (error, req, res, _next) => {
  const normalizedError = normalizeDatabaseError(error)

  const statusCode = normalizedError.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR

  const isServerError = statusCode >= HTTP_STATUS.INTERNAL_SERVER_ERROR

  if (isServerError) {
    console.error(normalizedError)
  }

  const message =
    isServerError && process.env.NODE_ENV === 'production' ? 'Internal server error' : normalizedError.message

  if (req.originalUrl.startsWith('/api')) {
    const errorResponse = {
      error: {
        message
      }
    }

    if (normalizedError.details) {
      errorResponse.error.details = normalizedError.details
    }

    return res.status(statusCode).json(errorResponse)
  }

  return res.status(statusCode).render('pages/error', {
    title: `Error ${statusCode}`,
    statusCode,
    message
  })
}

export default errorMiddleware
