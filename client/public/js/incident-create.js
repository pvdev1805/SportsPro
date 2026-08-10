import { requireRole } from './auth/auth-guard.js'
import { API_ROUTES, PAGE_ROUTES } from './constants/routes.js'
import { apiRequest } from './utils/api.js'
import { setFlashNotification, showError } from './utils/notification.js'

const form = document.querySelector('#incident-create-form')

const errorElement = document.querySelector('#incident-create-error')

const customerField = document.querySelector('#customer-field')

const customerSelect = document.querySelector('#customerId')

const productSelect = document.querySelector('#productCode')

const titleInput = document.querySelector('#title')

const descriptionInput = document.querySelector('#description')

const submitButton = document.querySelector('#incident-create-submit')

const renderCustomers = (customers) => {
  customerSelect.replaceChildren()

  const placeholder = document.createElement('option')

  placeholder.value = ''
  placeholder.textContent = '-- Select a Customer --'

  customerSelect.appendChild(placeholder)

  for (const customer of customers) {
    const option = document.createElement('option')

    option.value = customer.customerId
    option.textContent = `${customer.firstName} ${customer.lastName}`

    customerSelect.appendChild(option)
  }
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

const loadAdminCustomers = async () => {
  const customersResult = await apiRequest(API_ROUTES.CUSTOMERS, {}, 'Failed to load customers')

  renderCustomers(customersResult.data ?? [])

  productSelect.replaceChildren()

  const placeholder = document.createElement('option')

  placeholder.value = ''
  placeholder.textContent = '-- Select a Customer First --'

  productSelect.appendChild(placeholder)
  productSelect.disabled = true

  customerField.hidden = false
}

const loadRegisteredProductsForCustomer = async (customerId) => {
  productSelect.disabled = true
  productSelect.replaceChildren()

  const loadingOption = document.createElement('option')

  loadingOption.value = ''
  loadingOption.textContent = 'Loading registered products...'

  productSelect.appendChild(loadingOption)

  const registrationsResult = await apiRequest(
    `${API_ROUTES.REGISTRATIONS}/${customerId}`,
    {},
    'Failed to load registered products'
  )

  const products = (registrationsResult.data ?? []).map((registration) => registration.product).filter(Boolean)

  renderProducts(products)
  productSelect.disabled = false
}

const handleCustomerChange = async () => {
  const customerId = Number(customerSelect.value)

  if (!Number.isInteger(customerId) || customerId <= 0) {
    productSelect.replaceChildren()

    const placeholder = document.createElement('option')

    placeholder.value = ''
    placeholder.textContent = '-- Select a Customer First --'

    productSelect.appendChild(placeholder)
    productSelect.disabled = true

    return
  }

  try {
    await loadRegisteredProductsForCustomer(customerId)
  } catch (error) {
    console.error('Error loading registered products:', error)

    showError(error.message)
  }
}

const loadCustomerProducts = async () => {
  const profileResult = await apiRequest(API_ROUTES.PROFILE, {}, 'Failed to load customer profile')

  const customerId = profileResult.data?.profile?.customerId

  if (!customerId) {
    throw new Error('Customer profile could not be loaded')
  }

  const registrationsResult = await apiRequest(
    `${API_ROUTES.REGISTRATIONS}/${customerId}`,
    {},
    'Failed to load registered products'
  )

  const products = (registrationsResult.data ?? []).map((registration) => registration.product).filter(Boolean)

  renderProducts(products)
}

const buildRequestBody = (role) => {
  const data = {
    productCode: productSelect.value,
    title: titleInput.value.trim(),
    description: descriptionInput.value.trim()
  }

  if (role === 'admin') {
    data.customerId = Number(customerSelect.value)
  }

  return data
}

const setSubmitting = (isSubmitting) => {
  submitButton.disabled = isSubmitting
  submitButton.textContent = isSubmitting ? 'Creating...' : 'Create Incident'
}

const handleSubmit = async (event, role) => {
  event.preventDefault()

  const incidentData = buildRequestBody(role)

  if (role === 'admin' && !incidentData.customerId) {
    showError('Please select a customer')
    return
  }

  if (!incidentData.productCode) {
    showError('Please select a product')
    return
  }

  setSubmitting(true)

  try {
    const result = await apiRequest(
      API_ROUTES.INCIDENTS,
      {
        method: 'POST',
        body: JSON.stringify(incidentData)
      },
      'Failed to create incident'
    )

    const incidentId = result.data?.incidentId

    setFlashNotification(
      'success',
      incidentId ? `Incident #${incidentId} was created successfully!` : 'Incident was created successfully!'
    )

    window.location.href = PAGE_ROUTES.INCIDENTS
  } catch (error) {
    console.error('Error creating incident:', error)

    showError(error.message)
  } finally {
    setSubmitting(false)
  }
}

const init = async () => {
  try {
    const authState = await requireRole('admin', 'customer')

    if (!authState) {
      return
    }

    const role = authState.user.role

    if (role === 'admin') {
      await loadAdminCustomers()

      customerSelect.addEventListener('change', handleCustomerChange)
    } else {
      await loadCustomerProducts()
    }

    form.addEventListener('submit', (event) => handleSubmit(event, role))
  } catch (error) {
    console.error('Unable to initialize incident creation:', error)

    errorElement.textContent = error.message || 'Unable to initialize incident creation.'

    errorElement.hidden = false
  }
}

init()
