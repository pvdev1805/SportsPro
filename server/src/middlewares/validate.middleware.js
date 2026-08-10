import { BadRequestError } from '../utils/app-error.js'

const formatValidationErrors = (issues) => {
  return issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message
  }))
}

const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query
    })

    if (!result.success) {
      const error = new BadRequestError('Request validation failed')

      error.details = formatValidationErrors(result.error.issues)

      return next(error)
    }

    req.validated = result.data

    next()
  }
}

export default validate
