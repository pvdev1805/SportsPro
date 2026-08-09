import { HTTP_STATUS } from '../constants/http-status.js'

const errorMiddleware = (error, req, res, _next) => {
  const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
  const isServerError = statusCode >= HTTP_STATUS.INTERNAL_SERVER_ERROR

  if (isServerError) {
    console.error(error)
  }

  const message = isServerError && process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message

  if (req.originalUrl.startsWith('/api')) {
    const errorResponse = {
      error: {
        message
      }
    }

    if (error.details) {
      errorResponse.error.details = error.details
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
