import { redirectAuthenticatedUser } from '../auth/auth-guard.js'
import { registerCustomer } from '../auth/auth-session.js'
import {
  compactValidationErrors,
  keepFirstErrorPerField,
  validateEmail,
  validateLength,
  validateRequired,
  validatePattern
} from '../validation/form-validation.js'
import { clearFieldErrors, focusFirstInvalidField, showFieldErrors } from '../validation/form-errors.js'

const form = document.querySelector('#register-form')

const errorElement = document.querySelector('#register-error')

const submitButton = document.querySelector('#register-submit')

const showError = (message) => {
  errorElement.textContent = message
  errorElement.hidden = false
}

const clearError = () => {
  errorElement.textContent = ''
  errorElement.hidden = true
}

const setSubmitting = (isSubmitting) => {
  submitButton.disabled = isSubmitting
  submitButton.textContent = isSubmitting ? 'Creating account...' : 'Create Account'
}

const getFieldValue = (fieldName) => {
  const field = form.elements.namedItem(fieldName)

  return typeof field?.value === 'string' ? field.value : ''
}

const validateRegisterForm = () => {
  const firstName = getFieldValue('firstName')
  const lastName = getFieldValue('lastName')
  const email = getFieldValue('email')
  const password = getFieldValue('password')
  const address = getFieldValue('address')
  const city = getFieldValue('city')
  const state = getFieldValue('state')
  const postalCode = getFieldValue('postalCode')
  const countryCode = getFieldValue('countryCode')
  const phone = getFieldValue('phone')

  return keepFirstErrorPerField(
    compactValidationErrors([
      validateEmail('email', email, 'Email'),
      validateLength('email', email, {
        label: 'Email',
        max: 100
      }),

      validateRequired('password', password, 'Password'),
      validateLength('password', password, {
        label: 'Password',
        min: 8,
        max: 72
      }),
      validatePattern('password', password, {
        label: 'Password',
        pattern: /[A-Z]/,
        message: 'Password must contain at least one uppercase letter'
      }),
      validatePattern('password', password, {
        label: 'Password',
        pattern: /[a-z]/,
        message: 'Password must contain at least one lowercase letter'
      }),
      validatePattern('password', password, {
        label: 'Password',
        pattern: /\d/,
        message: 'Password must contain at least one number'
      }),
      validatePattern('password', password, {
        label: 'Password',
        pattern: /[^A-Za-z0-9]/,
        message: 'Password must contain at least one special character'
      }),

      validateRequired('firstName', firstName, 'First name'),
      validateLength('firstName', firstName, {
        label: 'First name',
        max: 50
      }),

      validateRequired('lastName', lastName, 'Last name'),
      validateLength('lastName', lastName, {
        label: 'Last name',
        max: 50
      }),

      validateRequired('address', address, 'Address'),
      validateLength('address', address, {
        label: 'Address',
        max: 50
      }),

      validateRequired('city', city, 'City'),
      validateLength('city', city, {
        label: 'City',
        max: 50
      }),

      validateRequired('state', state, 'State'),
      validateLength('state', state, {
        label: 'State',
        max: 50
      }),

      validateRequired('postalCode', postalCode, 'Postal code'),
      validateLength('postalCode', postalCode, {
        label: 'Postal code',
        max: 20
      }),

      validateRequired('countryCode', countryCode, 'Country code'),
      validateLength('countryCode', countryCode, {
        label: 'Country code',
        min: 2,
        max: 2
      }),

      validateRequired('phone', phone, 'Phone'),
      validateLength('phone', phone, {
        label: 'Phone',
        max: 20
      })
    ])
  )
}

const getRegistrationData = () => {
  const formData = new FormData(form)

  return {
    firstName: formData.get('firstName')?.trim(),
    lastName: formData.get('lastName')?.trim(),
    email: formData.get('email')?.trim(),
    password: formData.get('password'),
    address: formData.get('address')?.trim(),
    city: formData.get('city')?.trim(),
    state: formData.get('state')?.trim(),
    postalCode: formData.get('postalCode')?.trim(),
    countryCode: formData.get('countryCode')?.trim().toUpperCase(),
    phone: formData.get('phone')?.trim()
  }
}

const handleSubmit = async (event) => {
  event.preventDefault()

  clearError()
  clearFieldErrors(form)

  const validationErrors = validateRegisterForm()

  if (validationErrors.length > 0) {
    showFieldErrors(form, validationErrors)

    focusFirstInvalidField(form, validationErrors)

    return
  }

  setSubmitting(true)

  try {
    await registerCustomer(getRegistrationData())

    window.location.replace('/')
  } catch (error) {
    showError(error.message || 'Unable to create your account. Please try again.')
  } finally {
    setSubmitting(false)
  }
}

const handleInput = (event) => {
  const field = event.target

  if (!(
    field instanceof HTMLInputElement ||
    field instanceof HTMLSelectElement ||
    field instanceof HTMLTextAreaElement
  )) {
    return
  }

  const fieldError = form.querySelector(`#${field.name}-error`)

  if (fieldError) {
    fieldError.textContent = ''
    fieldError.hidden = true
  }

  field.removeAttribute('aria-invalid')
  field.removeAttribute('aria-describedby')
}

const init = async () => {
  try {
    const authState = await redirectAuthenticatedUser()

    if (authState.isAuthenticated) {
      return
    }
  } catch (error) {
    showError(error.message || 'Unable to restore your session.')
  }

  form.addEventListener('submit', handleSubmit)

  form.addEventListener('input', handleInput)
}

init()
