import { User } from '../models/index.js'
import { verifyAccessToken } from '../security/token.js'
import { ForbiddenError, UnauthorizedError } from '../utils/app-error.js'

const getBearerToken = (authorizationHeader) => {
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Authentication token is missing or invalid')
  }

  const [scheme, token] = authorizationHeader.split(' ')

  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    throw new UnauthorizedError('Invalid authentication header')
  }

  return token
}

const authenticate = async (req, res, next) => {
  try {
    const token = getBearerToken(req.get('Authorization'))

    let payload

    try {
      payload = verifyAccessToken(token)
    } catch {
      throw new UnauthorizedError(`Invalid or expired access token.`)
    }

    const userId = Number(payload.sub)

    if (!Number.isInteger(userId) || userId <= 0) {
      throw new UnauthorizedError('Invalid user ID in token payload or invalid access token')
    }

    const user = await User.findByPk(userId)

    if (!user) {
      throw new UnauthorizedError('Invalid access token: user does not exist')
    }

    if (!user.isActive) {
      throw new ForbiddenError('User account is inactive')
    }

    if (user.role !== payload.role) {
      throw new UnauthorizedError('Invalid access token: role mismatch')
    }

    req.user = {
      userId: user.userId,
      email: user.email,
      role: user.role
    }

    next()
  } catch (error) {
    next(error)
  }
}

export default authenticate
