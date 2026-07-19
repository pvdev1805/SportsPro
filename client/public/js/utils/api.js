const parseResponseBody = async (response) => {
  const contentType = response.headers.get('content-type')

  if (!contentType?.includes('application/json')) {
    return null
  }

  return response.json()
}

const getErrorMessage = (result, fallbackMessage) => {
  return result?.error?.message || result?.message || fallbackMessage
}

export const apiRequest = async (url, options = {}, fallbackMessage = 'An unexpected error occurred') => {
  const response = await fetch(url, options)
  const result = await parseResponseBody(response)

  if (!response.ok) {
    throw new Error(getErrorMessage(result, fallbackMessage))
  }

  return result
}
