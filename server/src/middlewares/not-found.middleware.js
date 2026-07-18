import { NotFoundError } from '../utils/app-error.js'

const notFoundMiddleware = (req, res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} was not found!`))
}

export default notFoundMiddleware
