import { PAGE_ROUTES } from '../constants/routes.js'
import { restoreSession } from './auth-session.js'

const getDefaultRouteForRole = (role) => {
  switch (role) {
    case 'admin':
      return PAGE_ROUTES.HOME

    case 'technician':
      return PAGE_ROUTES.HOME

    case 'customer':
      return PAGE_ROUTES.HOME

    default:
      return PAGE_ROUTES.HOME
  }
}

export const requireAuth = async () => {
  const authState = await restoreSession()

  if (!authState.isAuthenticated) {
    window.location.replace(PAGE_ROUTES.LOGIN)
    return null
  }

  return authState
}

export const requireRole = async (...allowedRoles) => {
  const authState = await requireAuth()

  if (!authState) {
    return null
  }

  if (!allowedRoles.includes(authState.user.role)) {
    window.location.replace(getDefaultRouteForRole(authState.user.role))

    return null
  }

  return authState
}

export const redirectAuthenticatedUser = async () => {
  const authState = await restoreSession()

  if (!authState.isAuthenticated) {
    return authState
  }

  window.location.replace(getDefaultRouteForRole(authState.user.role))

  return authState
}
