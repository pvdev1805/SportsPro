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
  validatePattern,
  validatePositiveNumber,
  validateRequired
} from './validation/form-validation.js'

import { clearFieldErrors, focusFirstInvalidField, showFieldErrors } from './validation/form-errors.js'

const productCreateForm = document.querySelector('#product-create-form')

const validateProductCreateForm = () => {
  const formData = new FormData(productCreateForm)

  const productCode = formData.get('productCode')?.trim() ?? ''

  const name = formData.get('name')?.trim() ?? ''

  const version = formData.get('version') ?? ''

  const releaseDate = formData.get('releaseDate') ?? ''

  return keepFirstErrorPerField(
    compactValidationErrors([
      validateRequired('productCode', productCode, 'Product code'),
      validateLength('productCode', productCode, {
        label: 'Product code',
        max: 10
      }),
      validatePattern('productCode', productCode, {
        label: 'Product code',
        pattern: /^[A-Za-z0-9]+$/,
        message: 'Product code may only contain letters and numbers'
      }),

      validateRequired('name', name, 'Product name'),
      validateLength('name', name, {
        label: 'Product name',
        max: 50
      }),

      validateRequired('version', version, 'Product version'),
      validatePositiveNumber('version', version, 'Product version'),
      validateOneDecimalPlace('version', version, 'Product version'),

      validateDate('releaseDate', releaseDate, 'Release date')
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

  const fieldError = productCreateForm.querySelector(`#${field.name}-error`)

  if (fieldError) {
    fieldError.textContent = ''
    fieldError.hidden = true
  }

  field.removeAttribute('aria-invalid')
  field.removeAttribute('aria-describedby')
}

const handleCreateProduct = async (event) => {
  event.preventDefault()

  clearFieldErrors(productCreateForm)

  const validationErrors = validateProductCreateForm()

  if (validationErrors.length > 0) {
    showFieldErrors(productCreateForm, validationErrors)

    focusFirstInvalidField(productCreateForm, validationErrors)

    return
  }

  const formData = new FormData(productCreateForm)

  const productData = {
    productCode: formData.get('productCode').trim(),
    name: formData.get('name').trim(),
    version: Number(formData.get('version')),
    releaseDate: formData.get('releaseDate')
  }

  try {
    await apiRequest(
      API_ROUTES.PRODUCTS,
      {
        method: 'POST',
        body: JSON.stringify(productData)
      },
      'Failed to create product'
    )

    setFlashNotification('success', `Product "${productData.productCode}" was created successfully!`)

    window.location.href = PAGE_ROUTES.PRODUCTS
  } catch (error) {
    console.error('Error creating product:', error)

    showError(error.message)
  }
}

const init = async () => {
  try {
    const authState = await requireRole('admin')

    if (!authState) {
      return
    }

    productCreateForm.addEventListener('submit', handleCreateProduct)

    productCreateForm.addEventListener('input', handleInput)
  } catch (error) {
    console.error('Unable to initialize product form:', error)

    showError(error.message || 'Unable to initialize product form.')
  }
}

init()
