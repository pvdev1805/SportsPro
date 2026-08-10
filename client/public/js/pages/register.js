import { redirectAuthenticatedUser } from '../auth/auth-guard.js'

import { registerCustomer } from '../auth/auth-session.js'

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

const getRegistrationData = () => {
  const formData = new FormData(form)

  return {
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    password: formData.get('password'),
    address: formData.get('address'),
    city: formData.get('city'),
    state: formData.get('state'),
    postalCode: formData.get('postalCode'),
    countryCode: formData.get('countryCode'),
    phone: formData.get('phone')
  }
}

const handleSubmit = async (event) => {
  event.preventDefault()

  clearError()
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
