import { redirectAuthenticatedUser } from '../auth/auth-guard.js'

import { signIn } from '../auth/auth-session.js'

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

const handleSubmit = async (event) => {
  event.preventDefault()

  clearError()
  setSubmitting(true)

  try {
    await signIn({
      email: emailInput.value,
      password: passwordInput.value
    })

    window.location.replace('/')
  } catch (error) {
    showError(error.message || 'Unable to sign in. Please try again.')
  } finally {
    setSubmitting(false)
  }
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
}

init()
