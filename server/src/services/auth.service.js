import sequelize from '../config/database.js'
import { Customer, RefreshToken, User } from '../models/index.js'
import { hashPassword, verifyPassword } from '../security/password.js'
import { generateAccessToken, generateRefreshToken, hashRefreshToken, verifyRefreshToken } from '../security/token.js'
import { ConflictError, ForbiddenError, UnauthorizedError } from '../utils/app-error.js'

const normalizeEmail = (email) => {
  return email.trim().toLowerCase()
}

const toPublicUser = (user) => {
  return {
    userId: user.userId,
    email: user.email,
    role: user.role,
    isActive: user.isActive
  }
}

const createSession = async (user, options = {}) => {
  const accessToken = generateAccessToken(user.userId, user.role)

  const refreshToken = generateRefreshToken(user.userId, user.role)

  const refreshPayload = verifyRefreshToken(refreshToken)

  const tokenHash = hashRefreshToken(refreshToken)

  await RefreshToken.create(
    {
      userId: user.userId,
      tokenHash,
      expiresAt: new Date(refreshPayload.exp * 1000)
    },
    options
  )

  return {
    accessToken,
    refreshToken
  }
}

const registerCustomer = async (registrationData) => {
  const email = normalizeEmail(registrationData.email)

  const existingUser = await User.findOne({
    where: { email }
  })

  if (existingUser) {
    throw new ConflictError(`User with email ${email} already exists`)
  }

  const passwordHash = await hashPassword(registrationData.password)

  return sequelize.transaction(async (transaction) => {
    const user = await User.create(
      {
        email,
        passwordHash,
        role: 'customer',
        isActive: true
      },
      { transaction }
    )

    const customer = await Customer.create(
      {
        userId: user.userId,
        firstName: registrationData.firstName,
        lastName: registrationData.lastName,
        address: registrationData.address,
        city: registrationData.city,
        state: registrationData.state,
        postalCode: registrationData.postalCode,
        countryCode: registrationData.countryCode,
        phone: registrationData.phone
      },
      { transaction }
    )

    const tokens = await createSession(user, { transaction })

    return {
      user: toPublicUser(user),
      customer,
      ...tokens
    }
  })
}

const login = async (credentials) => {
  const email = normalizeEmail(credentials.email)

  const user = await User.scope('withPasswordHash').findOne({
    where: { email }
  })

  if (!user) {
    throw new UnauthorizedError('Invalid email or password')
  }

  const passwordIsValid = await verifyPassword(credentials.password, user.passwordHash)

  if (!passwordIsValid) {
    throw new UnauthorizedError('Invalid email or password')
  }

  if (!user.isActive) {
    throw new ForbiddenError('User account is inactive')
  }

  const tokens = await createSession(user)

  return {
    user: toPublicUser(user),
    ...tokens
  }
}

const refreshSession = async (refreshToken) => {
  if (!refreshToken) {
    throw new UnauthorizedError('Refresh token is required')
  }

  let payload

  try {
    payload = verifyRefreshToken(refreshToken)
  } catch {
    throw new UnauthorizedError('Invalid or expired refresh token')
  }

  const tokenHash = hashRefreshToken(refreshToken)

  return sequelize.transaction(async (transaction) => {
    const storedToken = await RefreshToken.findOne({
      where: {
        tokenHash
      },
      transaction,
      lock: transaction.LOCK.UPDATE
    })

    if (!storedToken) {
      throw new UnauthorizedError('Invalid refresh token')
    }

    if (storedToken.revokedAt) {
      throw new UnauthorizedError('Refresh token has been revoked')
    }

    if (storedToken.expiresAt <= new Date()) {
      throw new UnauthorizedError('Refresh token has expired')
    }

    if (String(storedToken.userId) !== payload.sub) {
      throw new UnauthorizedError('Invalid refresh token')
    }

    const user = await User.findByPk(storedToken.userId, { transaction })

    if (!user) {
      throw new UnauthorizedError('Invalid refresh token: user not found')
    }

    if (!user.isActive) {
      throw new ForbiddenError('This account is inactive')
    }

    await storedToken.update(
      {
        revokedAt: new Date()
      },
      {
        transaction
      }
    )

    const tokens = await createSession(user, {
      transaction
    })

    return {
      user: toPublicUser(user),
      ...tokens
    }
  })
}

const logout = async (refreshToken) => {
  if (!refreshToken) {
    return
  }

  const tokenHash = hashRefreshToken(refreshToken)

  await sequelize.transaction(async (transaction) => {
    const storedToken = await RefreshToken.findOne({
      where: {
        tokenHash
      },
      transaction,
      lock: transaction.LOCK.UPDATE
    })

    if (!storedToken || storedToken.revokedAt) {
      return
    }

    await storedToken.update(
      {
        revokedAt: new Date()
      },
      { transaction }
    )
  })
}

const authService = {
  registerCustomer,
  login,
  refreshSession,
  logout
}

export default authService
