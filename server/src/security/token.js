import jwt from 'jsonwebtoken'

const ACCESS_TOKEN_TYPE = 'access'
const REFRESH_TOKEN_TYPE = 'refresh'

const TOKEN_ISSUER = 'sportspro-api'
const TOKEN_AUDIENCE = 'sportspro-client'
const TOKEN_ALGORITHM = 'HS256'

const VALID_ROLES = ['admin', 'technician', 'customer']

const {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES_IN = '15m',
  JWT_REFRESH_EXPIRES_IN = '7d'
} = process.env

if (!JWT_ACCESS_SECRET) {
  throw new Error('Missing required environment variable: JWT_ACCESS_SECRET')
}

if (!JWT_REFRESH_SECRET) {
  throw new Error('Missing required environment variable: JWT_REFRESH_SECRET')
}

if (JWT_ACCESS_SECRET === JWT_REFRESH_SECRET) {
  throw new Error('JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be different')
}

const validateTokenPayload = (payload, expectedType) => {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Invalid token payload')
  }

  if (!payload.sub) {
    throw new Error('Token payload missing subject (sub)')
  }

  if (!payload.role || !VALID_ROLES.includes(payload.role)) {
    throw new Error('Token payload has invalid role')
  }

  if (payload.type !== expectedType) {
    throw new Error(`Token payload type mismatch. Expected: ${expectedType}, Found: ${payload.type}`)
  }

  return payload
}

const generateToken = ({ userId, role, type, secret, expiresIn }) => {
  if (!userId) {
    throw new Error('User ID is required to generate token')
  }

  if (!role || !VALID_ROLES.includes(role)) {
    throw new Error(`Invalid user role: ${role}. Valid roles are: ${VALID_ROLES.join(', ')}`)
  }

  return jwt.sign({ role, type }, secret, {
    subject: String(userId),
    expiresIn,
    issuer: TOKEN_ISSUER,
    audience: TOKEN_AUDIENCE,
    algorithm: TOKEN_ALGORITHM
  })
}

const verifyToken = (token, secret, expectedType) => {
  const payload = jwt.verify(token, secret, {
    algorithms: [TOKEN_ALGORITHM],
    issuer: TOKEN_ISSUER,
    audience: TOKEN_AUDIENCE
  })

  return validateTokenPayload(payload, expectedType)
}

export const generateAccessToken = (userId, role) => {
  return generateToken({
    userId,
    role,
    type: ACCESS_TOKEN_TYPE,
    secret: JWT_ACCESS_SECRET,
    expiresIn: JWT_ACCESS_EXPIRES_IN
  })
}

export const generateRefreshToken = (userId, role) => {
  return generateToken({
    userId,
    role,
    type: REFRESH_TOKEN_TYPE,
    secret: JWT_REFRESH_SECRET,
    expiresIn: JWT_REFRESH_EXPIRES_IN
  })
}

export const verifyAccessToken = (token) => {
  return verifyToken(token, JWT_ACCESS_SECRET, ACCESS_TOKEN_TYPE)
}

export const verifyRefreshToken = (token) => {
  return verifyToken(token, JWT_REFRESH_SECRET, REFRESH_TOKEN_TYPE)
}
