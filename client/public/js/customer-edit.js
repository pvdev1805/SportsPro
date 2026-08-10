import { requireRole } from './auth/auth-guard.js'
import { API_ROUTES, PAGE_ROUTES } from './constants/routes.js'
import { apiRequest } from './utils/api.js'
import { setFlashNotification, showError } from './utils/notification.js'

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

const handleSubmit = async (event) => {
  event.preventDefault()

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
  } catch (error) {
    console.error('Unable to load customer:', error)

    errorElement.textContent = error.message || 'Unable to load customer.'

    errorElement.hidden = false
  }
}

init()
