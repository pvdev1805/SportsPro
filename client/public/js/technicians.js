import { API_ROUTES } from './constants/routes.js'
import { apiRequest } from './utils/api.js'
import { confirmDelete } from './utils/confirmation.js'
import { setFlashNotification, showFlashNotification } from './utils/notification.js'

const deleteButtons = document.querySelectorAll('.technician-delete-button')

const handleDeleteTechnician = async (event) => {
  const deleteButton = event.currentTarget

  const technicianId = deleteButton.dataset.technicianId

  const confirmed = await confirmDelete({ itemLabel: 'Technician' })

  if (!confirmed) {
    return
  }

  try {
    deleteButton.disabled = true

    const result = await apiRequest(
      `${API_ROUTES.TECHNICIANS}/${technicianId}`,
      {
        method: 'DELETE'
      },
      'Failed to delete technician'
    )

    const technicianFirstName = result.data.firstName

    setFlashNotification('success', `Technician "${technicianFirstName}" was deleted successfully!`)
    window.location.reload()
  } catch (error) {
    deleteButton.disabled = false
    console.error('Error deleting technician:', error)
    showError(error.message)
  }
}

if (deleteButtons) {
  deleteButtons.forEach((button) => {
    button.addEventListener('click', handleDeleteTechnician)
  })
}

showFlashNotification()
