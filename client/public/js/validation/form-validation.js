const normalizeValue = (value) => {
  return typeof value === 'string' ? value.trim() : value
}

export const createValidationError = (field, message) => {
  return {
    field,
    message
  }
}

export const validateRequired = (field, value, label) => {
  const normalizedValue = normalizeValue(value)

  if (normalizedValue === '' || normalizedValue === null || normalizedValue === undefined) {
    return createValidationError(field, `${label} is required`)
  }

  return null
}

export const validateEmail = (field, value, label = 'Email') => {
  const requiredError = validateRequired(field, value, label)

  if (requiredError) {
    return requiredError
  }

  const email = normalizeValue(value)

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailPattern.test(email)) {
    return createValidationError(field, `${label} must be a valid email address`)
  }

  return null
}

export const validateLength = (field, value, { label, min, max }) => {
  const normalizedValue = normalizeValue(value)

  if (normalizedValue === '' || normalizedValue === null || normalizedValue === undefined) {
    return null
  }

  if (min !== undefined && normalizedValue.length < min) {
    return createValidationError(field, `${label} must be at least ${min} characters`)
  }

  if (max !== undefined && normalizedValue.length > max) {
    return createValidationError(field, `${label} must not exceed ${max} characters`)
  }

  return null
}

export const validatePositiveNumber = (field, value, label) => {
  const numberValue = Number(value)

  if (!Number.isFinite(numberValue) || numberValue <= 0) {
    return createValidationError(field, `${label} must be greater than 0`)
  }

  return null
}

export const validatePositiveInteger = (field, value, label) => {
  const normalizedValue = normalizeValue(value)

  if (normalizedValue === '' || normalizedValue === null || normalizedValue === undefined) {
    return null
  }

  const numberValue = Number(normalizedValue)

  if (!Number.isInteger(numberValue) || numberValue <= 0) {
    return createValidationError(field, `${label} must be a positive integer`)
  }

  return null
}

export const validateOneDecimalPlace = (field, value, label) => {
  const numberValue = Number(value)

  if (!Number.isFinite(numberValue) || !Number.isInteger(numberValue * 10)) {
    return createValidationError(field, `${label} must have at most one decimal place`)
  }

  return null
}

export const validateDate = (field, value, label) => {
  const requiredError = validateRequired(field, value, label)

  if (requiredError) {
    return requiredError
  }

  const normalizedValue = normalizeValue(value)

  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalizedValue)) {
    return createValidationError(field, `${label} must use YYYY-MM-DD format`)
  }

  const date = new Date(`${normalizedValue}T00:00:00Z`)

  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== normalizedValue) {
    return createValidationError(field, `${label} must be a valid calendar date`)
  }

  return null
}

export const compactValidationErrors = (errors) => {
  return errors.filter(Boolean)
}

export const validatePattern = (field, value, { label, pattern, message }) => {
  const normalizedValue = normalizeValue(value)

  if (normalizedValue === '' || normalizedValue === null || normalizedValue === undefined) {
    return null
  }

  if (!pattern.test(normalizedValue)) {
    return createValidationError(field, message || `${label} is invalid`)
  }

  return null
}

export const keepFirstErrorPerField = (errors) => {
  const seenFields = new Set()

  return errors.filter((error) => {
    if (seenFields.has(error.field)) {
      return false
    }

    seenFields.add(error.field)
    return true
  })
}
