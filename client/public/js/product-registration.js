import { requireRole } from './auth/auth-guard.js'
import { API_ROUTES } from './constants/routes.js'
import { apiRequest } from './utils/api.js'
import { showError } from './utils/notification.js'

const registrationForm = document.querySelector('#product-registration-form')

const registrationPanel = document.querySelector('.registration-panel')

const successPanel = document.querySelector('#registration-success')

const errorElement = document.querySelector('#registration-error')

const productSelect = document.querySelector('#productCode')

const customerNameElement = document.querySelector('#customer-name')

const successMessageElement = document.querySelector('#registration-success-message')

const registerAnotherButton = document.querySelector('#register-another-btn')

const showPageError = (message) => {
  errorElement.textContent = message
  errorElement.hidden = false
}

const clearPageError = () => {
  errorElement.textContent = ''
  errorElement.hidden = true
}

const loadCustomerProfile = async () => {
  const result = await apiRequest(API_ROUTES.PROFILE, {}, 'Failed to load customer profile')

  const customerProfile = result.data?.profile

  if (!customerProfile) {
    throw new Error('Customer profile could not be loaded')
  }

  customerNameElement.textContent = `${customerProfile.firstName} ${customerProfile.lastName}`
}

const renderProducts = (products) => {
  productSelect.replaceChildren()

  const placeholder = document.createElement('option')

  placeholder.value = ''
  placeholder.textContent = '-- Select a Product --'

  productSelect.appendChild(placeholder)

  for (const product of products) {
    const option = document.createElement('option')

    option.value = product.productCode
    option.textContent = `${product.productCode} - ${product.name}`

    productSelect.appendChild(option)
  }
}

const loadProducts = async () => {
  const result = await apiRequest(API_ROUTES.PRODUCTS, {}, 'Failed to load products')

  renderProducts(result.data ?? [])
}

const handleProductRegistration = async (event) => {
  event.preventDefault()

  clearPageError()

  const productCode = productSelect.value

  if (!productCode) {
    showError('Please select a product')
    return
  }

  try {
    const result = await apiRequest(
      API_ROUTES.REGISTRATIONS,
      {
        method: 'POST',
        body: JSON.stringify({
          productCode
        })
      },
      'Failed to register product'
    )

    const registeredProductName =
      result.data?.product?.name ?? productSelect.selectedOptions[0]?.textContent ?? productCode

    successMessageElement.textContent = `Product (${registeredProductName}) was registered successfully.`

    registrationPanel.hidden = true
    successPanel.hidden = false
  } catch (error) {
    console.error('Error registering product:', error)

    showError(error.message)
  }
}

const handleRegisterAnother = () => {
  productSelect.value = ''

  successPanel.hidden = true
  registrationPanel.hidden = false

  clearPageError()
}

const init = async () => {
  try {
    const authState = await requireRole('customer')

    if (!authState) {
      return
    }

    await Promise.all([loadCustomerProfile(), loadProducts()])

    registrationForm.addEventListener('submit', handleProductRegistration)

    registerAnotherButton.addEventListener('click', handleRegisterAnother)
  } catch (error) {
    console.error('Unable to initialize product registration:', error)

    showPageError(error.message || 'Unable to initialize product registration.')
  }
}

init()
