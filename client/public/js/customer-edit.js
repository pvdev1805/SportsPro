import { API_ROUTES, PAGE_ROUTES } from './constants/routes.js'
import { apiRequest } from './utils/api.js'
import { setFlashNotification, showError } from './utils/notification.js'

const customerEditForm = document.querySelector('#customer-edit-form')

const handleEditCustomer = async (event) => {
  event.preventDefault()

  const formData = new FormData(customerEditForm)
  const customerId = customerEditForm.dataset.customerId

  const customerData = {
    firstName: formData.get('firstName').trim(),
    lastName: formData.get('lastName').trim(),
    address: formData.get('address').trim(),
    city: formData.get('city').trim(),
    state: formData.get('state').trim(),
    postalCode: formData.get('postalCode').trim(),
    countryCode: formData.get('countryCode'),
    phone: formData.get('phone').trim(),
    email: formData.get('email').trim(),
    password: formData.get('password')
  }

  try {
    await apiRequest(
      `${API_ROUTES.CUSTOMERS}/${customerId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
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

if (customerEditForm) {
  customerEditForm.addEventListener('submit', handleEditCustomer)
}
