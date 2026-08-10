import { login, logout, refresh, register } from '../api/auth-api.js'

import { clearAuthSession, getAuthState, setAuthSession } from './auth-store.js'

let restorePromise = null

const storeSession = (session) => {
  setAuthSession({
    user: session.user,
    accessToken: session.accessToken
  })

  return session
}

export const signIn = async (credentials) => {
  const session = await login(credentials)

  return storeSession(session)
}

export const registerCustomer = async (registrationData) => {
  const session = await register(registrationData)

  storeSession(session)

  return session
}

export const restoreSession = async () => {
  const currentState = getAuthState()

  if (currentState.isAuthenticated) {
    return currentState
  }

  if (!restorePromise) {
    restorePromise = refresh()
      .then((session) => {
        storeSession(session)

        return getAuthState()
      })
      .catch((error) => {
        clearAuthSession()

        if (error.status === 401 || error.status === 403) {
          return getAuthState()
        }

        throw error
      })
      .finally(() => {
        restorePromise = null
      })
  }

  return restorePromise
}

export const signOut = async () => {
  try {
    await logout()
  } finally {
    clearAuthSession()
  }
}
