import { API_ROUTES, PAGE_ROUTES } from './constants/routes.js'
import { apiRequest } from './utils/api.js'
import { setFlashNotification, showError } from './utils/notification.js'

const technicianEditForm = document.querySelector('#technician-edit-form')

const handleEditTechnician = async (event) => {
  event.preventDefault()

  const formData = new FormData(technicianEditForm)

  const technicianId = technicianEditForm.dataset.technicianId

  const technicianData = {
    firstName: formData.get('firstName').trim(),
    lastName: formData.get('lastName').trim(),
    email: formData.get('email').trim(),
    phone: formData.get('phone').trim(),
    password: formData.get('password')
  }

  try {
    await apiRequest(
      `${API_ROUTES.TECHNICIANS}/${technicianId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
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
    console.error('Error editing technician:', error)
    showError(error.message)
  }
}

if (technicianEditForm) {
  technicianEditForm.addEventListener('submit', handleEditTechnician)
}
