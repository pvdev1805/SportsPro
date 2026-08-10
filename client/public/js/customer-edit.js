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

const form = document.querySelector('#customer-edit-form')

const errorElement = document.querySelector('#customer-edit-error')

const firstNameInput = document.querySelector('#firstName')

const lastNameInput = document.querySelector('#lastName')

const emailInput = document.querySelector('#email')

const addressInput = document.querySelector('#address')

const cityInput = document.querySelector('#city')

const stateInput = document.querySelector('#state')

const postalCodeInput = document.querySelector('#postalCode')

const countryCodeInput = document.querySelector('#countryCode')

const phoneInput = document.querySelector('#phone')

const getCustomerId = () => {
  const parts = window.location.pathname.split('/').filter(Boolean)

  return parts[1]
}

const populateForm = (customer) => {
  firstNameInput.value = customer.firstName ?? ''

  lastNameInput.value = customer.lastName ?? ''

  emailInput.value = customer.user?.email ?? ''

  addressInput.value = customer.address ?? ''

  cityInput.value = customer.city ?? ''

  stateInput.value = customer.state ?? ''

  postalCodeInput.value = customer.postalCode ?? ''

  countryCodeInput.value = customer.countryCode ?? ''

  phoneInput.value = customer.phone ?? ''
}

const loadCustomer = async (customerId) => {
  const result = await apiRequest(`${API_ROUTES.CUSTOMERS}/${customerId}`, {}, 'Failed to load customer')

  populateForm(result.data)
}

const validateCustomerEditForm = () => {
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

      validateRequired('address', addressInput.value, 'Address'),
      validateLength('address', addressInput.value, {
        label: 'Address',
        max: 50
      }),

      validateRequired('city', cityInput.value, 'City'),
      validateLength('city', cityInput.value, {
        label: 'City',
        max: 50
      }),

      validateRequired('state', stateInput.value, 'State'),
      validateLength('state', stateInput.value, {
        label: 'State',
        max: 50
      }),

      validateRequired('postalCode', postalCodeInput.value, 'Postal code'),
      validateLength('postalCode', postalCodeInput.value, {
        label: 'Postal code',
        max: 20
      }),

      validateRequired('countryCode', countryCodeInput.value, 'Country code'),
      validateLength('countryCode', countryCodeInput.value, {
        label: 'Country code',
        min: 2,
        max: 2
      }),
      validatePattern('countryCode', countryCodeInput.value, {
        label: 'Country code',
        pattern: /^[A-Za-z]{2}$/,
        message: 'Country code must contain letters only'
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

  const validationErrors = validateCustomerEditForm()

  if (validationErrors.length > 0) {
    showFieldErrors(form, validationErrors)

    focusFirstInvalidField(form, validationErrors)

    return
  }

  const customerId = getCustomerId()

  const customerData = {
    firstName: firstNameInput.value.trim(),
    lastName: lastNameInput.value.trim(),
    address: addressInput.value.trim(),
    city: cityInput.value.trim(),
    state: stateInput.value.trim(),
    postalCode: postalCodeInput.value.trim(),
    countryCode: countryCodeInput.value.trim().toUpperCase(),
    phone: phoneInput.value.trim(),
    email: emailInput.value.trim()
  }

  try {
    await apiRequest(
      `${API_ROUTES.CUSTOMERS}/${customerId}`,
      {
        method: 'PATCH',
        body: JSON.stringify(customerData)
      },
      'Failed to update customer'
    )

    setFlashNotification(
      'success',
      `Customer "${customerData.firstName} ${customerData.lastName}" was updated successfully!`
    )

    window.location.href = PAGE_ROUTES.CUSTOMERS
  } catch (error) {
    console.error('Error updating customer:', error)

    showError(error.message)
  }
}

const init = async () => {
  try {
    const authState = await requireRole('admin')

    if (!authState) {
      return
    }

    const customerId = getCustomerId()

    await loadCustomer(customerId)

    form.addEventListener('submit', handleSubmit)
    form.addEventListener('input', handleInput)
  } catch (error) {
    console.error('Unable to load customer:', error)

    errorElement.textContent = error.message || 'Unable to load customer.'

    errorElement.hidden = false
  }
}

init()
