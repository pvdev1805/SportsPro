import ms from 'ms'
import authService from '../../services/auth.service.js'

const REFRESH_TOKEN_COOKIE = 'refreshToken'
const REFRESH_TOKEN_COOKIE_MAX_AGE = ms(process.env.JWT_REFRESH_EXPIRES_IN || '7d') // Convert to milliseconds

const getRefreshTokenCookieOptions = () => {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/auth',
    maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE
  }
}

const getClearRefreshTokenCookieOptions = () => {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/auth'
  }
}

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const result = await authService.registerCustomer(req.validated.body)

    res.cookie(REFRESH_TOKEN_COOKIE, result.refreshToken, getRefreshTokenCookieOptions())

    return res.status(201).json({
      success: true,
      data: {
        user: result.user,
        customer: result.customer,
        accessToken: result.accessToken
      }
    })
  } catch (error) {
    next(error)
  }
}

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.validated.body)

    res.cookie(REFRESH_TOKEN_COOKIE, result.refreshToken, getRefreshTokenCookieOptions())

    return res.status(200).json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken
      }
    })
  } catch (error) {
    next(error)
  }
}

// POST /api/auth/refresh
const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE]

    const result = await authService.refreshSession(refreshToken)

    res.cookie(REFRESH_TOKEN_COOKIE, result.refreshToken, getRefreshTokenCookieOptions())

    return res.status(200).json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.accessToken
      }
    })
  } catch (error) {
    next(error)
  }
}

// POST /api/auth/logout
const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE]

    await authService.logout(refreshToken)

    res.clearCookie(REFRESH_TOKEN_COOKIE, getClearRefreshTokenCookieOptions())

    return res.status(204).send()
  } catch (error) {
    next(error)
  }
}

const authController = {
  register,
  login,
  refresh,
  logout
}

export default authController
