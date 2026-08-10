import { BadRequestError, ConflictError } from './app-error.js'

const mapValidationErrors = (error) => {
  return error.errors?.map((item) => ({
    field: item.path ?? 'unknown',
    message: item.message
  }))
}

const normalizeDatabaseError = (error) => {
  if (!error) {
    return error
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    const normalizedError = new ConflictError('A resource with the same unique value already exists')

    normalizedError.details = mapValidationErrors(error) ?? []

    return normalizedError
  }

  if (error.name === 'SequelizeValidationError') {
    const normalizedError = new BadRequestError('Database validation failed')

    normalizedError.details = mapValidationErrors(error) ?? []

    return normalizedError
  }

  if (error.name === 'SequelizeForeignKeyConstraintError') {
    const normalizedError = new BadRequestError(
      'The request references a related resource that does not exist or cannot be changed'
    )

    normalizedError.details = [
      {
        field: error.fields?.[0] ?? error.index ?? 'unknown',
        message: 'The referenced resource is invalid or currently in use'
      }
    ]

    return normalizedError
  }

  return error
}

export default normalizeDatabaseError
