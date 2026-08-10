import { clearAuthSession, getAccessToken, setAuthSession } from '../auth/auth-store.js'

import { refresh } from '../api/auth-api.js'

let refreshPromise = null

const parseResponseBody = async (response) => {
  const contentType = response.headers.get('content-type')

  if (!contentType?.includes('application/json')) {
    return null
  }

  return response.json()
}

const createApiError = (response, result, fallbackMessage) => {
  const error = new Error(result?.error?.message || result?.message || fallbackMessage)

  error.status = response.status
  error.details = result?.error?.details

  return error
}

const refreshSession = async () => {
  if (!refreshPromise) {
    refreshPromise = refresh()
      .then((session) => {
        setAuthSession({
          user: session.user,
          accessToken: session.accessToken
        })

        return session.accessToken
      })
      .catch((error) => {
        clearAuthSession()
        throw error
      })
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

const buildHeaders = (options, accessToken) => {
  const headers = new Headers(options.headers)

  if (options.body !== undefined && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  return headers
}

const executeRequest = async (url, options, accessToken) => {
  return fetch(url, {
    ...options,
    credentials: 'same-origin',
    headers: buildHeaders(options, accessToken)
  })
}

export const apiRequest = async (url, options = {}, fallbackMessage = 'An unexpected error occurred') => {
  let accessToken = getAccessToken()

  let response = await executeRequest(url, options, accessToken)

  if (response.status === 401 && accessToken) {
    try {
      accessToken = await refreshSession()

      response = await executeRequest(url, options, accessToken)
    } catch {
      const result = await parseResponseBody(response)

      throw createApiError(response, result, 'Your session has expired. Please sign in again.')
    }
  }

  const result = await parseResponseBody(response)

  if (!response.ok) {
    throw createApiError(response, result, fallbackMessage)
  }

  return result
}
