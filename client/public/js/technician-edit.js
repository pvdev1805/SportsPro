import { requireRole } from './auth/auth-guard.js'
import { API_ROUTES, PAGE_ROUTES } from './constants/routes.js'
import { apiRequest } from './utils/api.js'
import { setFlashNotification, showError } from './utils/notification.js'

const form = document.querySelector('#technician-edit-form')

const errorElement = document.querySelector('#technician-edit-error')

const firstNameInput = document.querySelector('#firstName')

const lastNameInput = document.querySelector('#lastName')

const emailInput = document.querySelector('#email')

const phoneInput = document.querySelector('#phone')

const getTechId = () => {
  const parts = window.location.pathname.split('/').filter(Boolean)

  return parts[1]
}

const populateForm = (technician) => {
  firstNameInput.value = technician.firstName ?? ''

  lastNameInput.value = technician.lastName ?? ''

  emailInput.value = technician.user?.email ?? ''

  phoneInput.value = technician.phone ?? ''
}

const loadTechnician = async (techId) => {
  const result = await apiRequest(`${API_ROUTES.TECHNICIANS}/${techId}`, {}, 'Failed to load technician')

  populateForm(result.data)
}

const handleSubmit = async (event) => {
  event.preventDefault()

  const techId = getTechId()

  const technicianData = {
    firstName: firstNameInput.value.trim(),
    lastName: lastNameInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim()
  }

  try {
    await apiRequest(
      `${API_ROUTES.TECHNICIANS}/${techId}`,
      {
        method: 'PATCH',
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
    showError(error.message)
  }
}

const init = async () => {
  try {
    const authState = await requireRole('admin')

    if (!authState) {
      return
    }

    const techId = getTechId()

    await loadTechnician(techId)

    form.addEventListener('submit', handleSubmit)
  } catch (error) {
    console.error('Unable to load technician:', error)

    errorElement.textContent = error.message || 'Unable to load technician.'

    errorElement.hidden = false
  }
}

init()
