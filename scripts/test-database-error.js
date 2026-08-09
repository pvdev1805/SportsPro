import normalizeDatabaseError from '../server/src/utils/database-error.js'

const error = {
  name: 'SequelizeUniqueConstraintError',
  errors: [
    {
      path: 'email',
      message: 'email must be unique'
    }
  ]
}

const normalized = normalizeDatabaseError(error)

console.log({
  name: normalized.name,
  statusCode: normalized.statusCode,
  message: normalized.message,
  details: normalized.details
})
