import { redirectAuthenticatedUser } from '../auth/auth-guard.js'
import { signIn } from '../auth/auth-session.js'
import { compactValidationErrors, validateEmail, validateRequired } from '../validation/form-validation.js'
import { clearFieldErrors, focusFirstInvalidField, showFieldErrors } from '../validation/form-errors.js'

const form = document.querySelector('#login-form')
const emailInput = document.querySelector('#email')
const passwordInput = document.querySelector('#password')
const errorElement = document.querySelector('#login-error')
const submitButton = document.querySelector('#login-submit')

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
  submitButton.textContent = isSubmitting ? 'Signing in...' : 'Sign In'
}

const validateLoginForm = () => {
  return compactValidationErrors([
    validateEmail('email', emailInput.value, 'Email'),
    validateRequired('password', passwordInput.value, 'Password')
  ])
}

const handleSubmit = async (event) => {
  event.preventDefault()

  clearError()
  clearFieldErrors(form)

  const validationErrors = validateLoginForm()

  if (validationErrors.length > 0) {
    showFieldErrors(form, validationErrors)

    focusFirstInvalidField(form, validationErrors)

    return
  }

  setSubmitting(true)

  try {
    await signIn({
      email: emailInput.value.trim(),
      password: passwordInput.value
    })

    window.location.replace('/')
  } catch (error) {
    showError(error.message || 'Unable to sign in. Please try again.')
  } finally {
    setSubmitting(false)
  }
}

const handleInput = (event) => {
  const field = event.target

  if (!(field instanceof HTMLInputElement)) {
    return
  }

  const errorElement = form.querySelector(`#${field.name}-error`)

  if (errorElement) {
    errorElement.textContent = ''
    errorElement.hidden = true
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
