import { API_ROUTES } from '../constants/routes.js'

const parseResponse = async (response) => {
  if (response.status === 204) {
    return null
  }

  const payload = await response.json()

  if (!response.ok) {
    const error = new Error(payload?.error?.message || 'Request failed')

    error.status = response.status
    error.details = payload?.error?.details

    throw error
  }

  return payload
}

const request = async (url, options = {}) => {
  const response = await fetch(url, {
    credentials: 'same-origin',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  })

  return parseResponse(response)
}

export const register = async (registrationData) => {
  const result = await request(API_ROUTES.AUTH.REGISTER, {
    method: 'POST',
    body: JSON.stringify(registrationData)
  })

  return result.data
}

export const login = async (credentials) => {
  const result = await request(API_ROUTES.AUTH.LOGIN, {
    method: 'POST',
    body: JSON.stringify(credentials)
  })

  return result.data
}

export const refresh = async () => {
  const result = await request(API_ROUTES.AUTH.REFRESH, {
    method: 'POST'
  })

  return result.data
}

export const logout = async () => {
  await request(API_ROUTES.AUTH.LOGOUT, {
    method: 'POST'
  })
}
