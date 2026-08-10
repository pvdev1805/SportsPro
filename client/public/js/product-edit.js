import { requireRole } from './auth/auth-guard.js'
import { API_ROUTES, PAGE_ROUTES } from './constants/routes.js'
import { apiRequest } from './utils/api.js'
import { setFlashNotification, showError } from './utils/notification.js'
import {
  compactValidationErrors,
  keepFirstErrorPerField,
  validateDate,
  validateLength,
  validateOneDecimalPlace,
  validatePositiveNumber,
  validateRequired
} from './validation/form-validation.js'

import { clearFieldErrors, focusFirstInvalidField, showFieldErrors } from './validation/form-errors.js'

const form = document.querySelector('#product-edit-form')

const errorElement = document.querySelector('#product-edit-error')

const nameInput = document.querySelector('#name')

const versionInput = document.querySelector('#version')

const releaseDateInput = document.querySelector('#releaseDate')

const getProductCode = () => {
  const parts = window.location.pathname.split('/').filter(Boolean)

  return parts[1]
}

const populateForm = (product) => {
  nameInput.value = product.name ?? ''

  versionInput.value = product.version ?? ''

  releaseDateInput.value = product.releaseDate?.slice(0, 10) ?? ''
}

const loadProduct = async (productCode) => {
  const result = await apiRequest(`${API_ROUTES.PRODUCTS}/${productCode}`, {}, 'Failed to load product')

  populateForm(result.data)
}

const validateProductEditForm = () => {
  return keepFirstErrorPerField(
    compactValidationErrors([
      validateRequired('name', nameInput.value, 'Product name'),
      validateLength('name', nameInput.value, {
        label: 'Product name',
        max: 50
      }),

      validateRequired('version', versionInput.value, 'Product version'),
      validatePositiveNumber('version', versionInput.value, 'Product version'),
      validateOneDecimalPlace('version', versionInput.value, 'Product version'),

      validateDate('releaseDate', releaseDateInput.value, 'Release date')
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

  const validationErrors = validateProductEditForm()

  if (validationErrors.length > 0) {
    showFieldErrors(form, validationErrors)

    focusFirstInvalidField(form, validationErrors)

    return
  }

  const productCode = getProductCode()

  const productData = {
    name: nameInput.value.trim(),
    version: Number(versionInput.value),
    releaseDate: releaseDateInput.value
  }

  try {
    await apiRequest(
      `${API_ROUTES.PRODUCTS}/${productCode}`,
      {
        method: 'PATCH',
        body: JSON.stringify(productData)
      },
      'Failed to update product'
    )

    setFlashNotification('success', `Product "${productCode}" was updated successfully!`)

    window.location.href = PAGE_ROUTES.PRODUCTS
  } catch (error) {
    console.error('Error editing product:', error)

    showError(error.message)
  }
}

const init = async () => {
  try {
    const authState = await requireRole('admin')

    if (!authState) {
      return
    }

    const productCode = getProductCode()

    await loadProduct(productCode)

    form.addEventListener('submit', handleSubmit)
    form.addEventListener('input', handleInput)
  } catch (error) {
    console.error('Unable to load product:', error)

    errorElement.textContent = error.message || 'Unable to load product.'

    errorElement.hidden = false
  }
}

init()
