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

const form = document.querySelector('#technician-edit-form')

const errorElement = document.querySelector('#technician-edit-error')

const firstNameInput = document.querySelector('#firstName')

const lastNameInput = document.querySelector('#lastName')

const emailInput = document.querySelector('#email')

const phoneInput = document.querySelector('#phone')

const getTechId = () => {
  const parts = window.location.pathname.split('/').filter(Boolean)

  return parts[1]
}

const populateForm = (technician) => {
  firstNameInput.value = technician.firstName ?? ''

  lastNameInput.value = technician.lastName ?? ''

  emailInput.value = technician.user?.email ?? ''

  phoneInput.value = technician.phone ?? ''
}

const loadTechnician = async (techId) => {
  const result = await apiRequest(`${API_ROUTES.TECHNICIANS}/${techId}`, {}, 'Failed to load technician')

  populateForm(result.data)
}

const validateTechnicianEditForm = () => {
  return keepFirstErrorPerField(
    compactValidationErrors([
      validateRequired('firstName', firstNameInput.value, 'First name'),
      validateLength('firstName', firstNameInput.value, {
        label: 'First name',
        max: 50
      }),

      validateRequired('lastName', lastNameInput.value, 'Last name'),
      validateLength('lastName', lastNameInput.value, {
        label: 'Last name',
        max: 50
      }),

      validateEmail('email', emailInput.value, 'Email'),
      validateLength('email', emailInput.value, {
        label: 'Email',
        max: 100
      }),

      validateRequired('phone', phoneInput.value, 'Phone number'),
      validateLength('phone', phoneInput.value, {
        label: 'Phone number',
        max: 20
      }),
      validatePattern('phone', phoneInput.value, {
        label: 'Phone number',
        pattern: /^[0-9+()\-\s]+$/,
        message: 'Phone number contains invalid characters'
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

  const fieldError = form.querySelector(`#${field.name}-error`)

  if (fieldError) {
    fieldError.textContent = ''
    fieldError.hidden = true
  }

  field.removeAttribute('aria-invalid')
  field.removeAttribute('aria-describedby')
}

const handleSubmit = async (event) => {
  event.preventDefault()

  clearFieldErrors(form)

  const validationErrors = validateTechnicianEditForm()

  if (validationErrors.length > 0) {
    showFieldErrors(form, validationErrors)

    focusFirstInvalidField(form, validationErrors)

    return
  }

  const techId = getTechId()

  const technicianData = {
    firstName: firstNameInput.value.trim(),
    lastName: lastNameInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim()
  }

  try {
    await apiRequest(
      `${API_ROUTES.TECHNICIANS}/${techId}`,
      {
        method: 'PATCH',
        body: JSON.stringify(technicianData)
      },
      'Failed to update technician'
    )

    setFlashNotification(
      'success',
      `Technician "${technicianData.firstName} ${technicianData.lastName}" was updated successfully!`
    )

    window.location.href = PAGE_ROUTES.TECHNICIANS
  } catch (error) {
    showError(error.message)
  }
}

const init = async () => {
  try {
    const authState = await requireRole('admin')

    if (!authState) {
      return
    }

    const techId = getTechId()

    await loadTechnician(techId)

    form.addEventListener('submit', handleSubmit)
    form.addEventListener('input', handleInput)
  } catch (error) {
    console.error('Unable to load technician:', error)

    errorElement.textContent = error.message || 'Unable to load technician.'

    errorElement.hidden = false
  }
}

init()
