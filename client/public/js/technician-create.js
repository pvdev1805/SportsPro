import { requireRole } from './auth/auth-guard.js'
import { API_ROUTES, PAGE_ROUTES } from './constants/routes.js'
import { apiRequest } from './utils/api.js'
import { setFlashNotification, showError } from './utils/notification.js'

import {
  compactValidationErrors,
  keepFirstErrorPerField,
  validateEmail,
  validateLength,
  validatePattern,
  validateRequired
} from './validation/form-validation.js'

import { clearFieldErrors, focusFirstInvalidField, showFieldErrors } from './validation/form-errors.js'

const technicianCreateForm = document.querySelector('#technician-create-form')

const validateTechnicianCreateForm = () => {
  const formData = new FormData(technicianCreateForm)

  const firstName = formData.get('firstName')?.trim() ?? ''

  const lastName = formData.get('lastName')?.trim() ?? ''

  const email = formData.get('email')?.trim() ?? ''

  const phone = formData.get('phone')?.trim() ?? ''

  const password = formData.get('password') ?? ''

  return keepFirstErrorPerField(
    compactValidationErrors([
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

      validateEmail('email', email, 'Email'),
      validateLength('email', email, {
        label: 'Email',
        max: 100
      }),

      validateRequired('phone', phone, 'Phone number'),
      validateLength('phone', phone, {
        label: 'Phone number',
        max: 20
      }),
      validatePattern('phone', phone, {
        label: 'Phone number',
        pattern: /^[0-9+()\-\s]+$/,
        message: 'Phone number contains invalid characters'
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
      })
    ])
  )
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

  const fieldError = technicianCreateForm.querySelector(`#${field.name}-error`)

  if (fieldError) {
    fieldError.textContent = ''
    fieldError.hidden = true
  }

  field.removeAttribute('aria-invalid')
  field.removeAttribute('aria-describedby')
}

const handleCreateTechnician = async (event) => {
  event.preventDefault()

  clearFieldErrors(technicianCreateForm)

  const validationErrors = validateTechnicianCreateForm()

  if (validationErrors.length > 0) {
    showFieldErrors(technicianCreateForm, validationErrors)

    focusFirstInvalidField(technicianCreateForm, validationErrors)

    return
  }

  const formData = new FormData(technicianCreateForm)

  const technicianData = {
    firstName: formData.get('firstName').trim(),
    lastName: formData.get('lastName').trim(),
    email: formData.get('email').trim(),
    phone: formData.get('phone').trim(),
    password: formData.get('password')
  }

  try {
    await apiRequest(
      API_ROUTES.TECHNICIANS,
      {
        method: 'POST',
        body: JSON.stringify(technicianData)
      },
      'Failed to create technician'
    )

    setFlashNotification(
      'success',
      `Technician "${technicianData.firstName} ${technicianData.lastName}" was created successfully!`
    )

    window.location.href = PAGE_ROUTES.TECHNICIANS
  } catch (error) {
    console.error('Error creating technician:', error)

    showError(error.message)
  }
}

const init = async () => {
  try {
    const authState = await requireRole('admin')

    if (!authState) {
      return
    }

    technicianCreateForm.addEventListener('submit', handleCreateTechnician)

    technicianCreateForm.addEventListener('input', handleInput)
  } catch (error) {
    console.error('Unable to initialize technician form:', error)

    showError(error.message || 'Unable to initialize technician form.')
  }
}

init()
