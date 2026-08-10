let currentUser = null
let accessToken = null

const listeners = new Set()

const notify = () => {
  const state = getAuthState()

  for (const listener of listeners) {
    listener(state)
  }
}

export const getAuthState = () => {
  return {
    user: currentUser,
    accessToken,
    isAuthenticated: Boolean(currentUser && accessToken)
  }
}

export const getCurrentUser = () => {
  return currentUser
}

export const getAccessToken = () => {
  return accessToken
}

export const setAuthSession = ({ user, accessToken: newAccessToken }) => {
  currentUser = user
  accessToken = newAccessToken

  notify()
}

export const clearAuthSession = () => {
  currentUser = null
  accessToken = null

  notify()
}

export const subscribeToAuth = (listener) => {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}
