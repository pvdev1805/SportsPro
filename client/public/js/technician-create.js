import { API_ROUTES, PAGE_ROUTES } from './constants/routes.js'
import { apiRequest } from './utils/api.js'
import { setFlashNotification, showError } from './utils/notification.js'

const technicianCreateForm = document.querySelector('#technician-create-form')

const handleCreateTechnician = async (event) => {
  event.preventDefault()

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
        headers: {
          'Content-Type': 'application/json'
        },
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

if (technicianCreateForm) {
  technicianCreateForm.addEventListener('submit', handleCreateTechnician)
}
