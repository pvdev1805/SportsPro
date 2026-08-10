import { requireRole } from './auth/auth-guard.js'
import { API_ROUTES } from './constants/routes.js'
import { apiRequest } from './utils/api.js'
import { confirmDelete } from './utils/confirmation.js'
import {
  setFlashNotification,
  showError,
  showFlashNotification
} from './utils/notification.js'

const tableBody =
  document.querySelector('#technicians-table-body')

const errorElement =
  document.querySelector('#technicians-error')

const renderTechnicians = (technicians) => {
  tableBody.replaceChildren()

  for (const technician of technicians) {
    const row = document.createElement('tr')

    const firstNameCell = document.createElement('td')
    firstNameCell.textContent = technician.firstName

    const lastNameCell = document.createElement('td')
    lastNameCell.textContent = technician.lastName

    const emailCell = document.createElement('td')
    emailCell.textContent = technician.user?.email ?? ''

    const phoneCell = document.createElement('td')
    phoneCell.textContent = technician.phone

    const statusCell = document.createElement('td')
    statusCell.textContent =
      technician.user?.isActive
        ? 'Active'
        : 'Inactive'

    const actionCell = document.createElement('td')
    const buttonGroup = document.createElement('div')
    buttonGroup.classList.add('button-group')

    const editLink = document.createElement('a')
    editLink.classList.add('btn', 'btn-primary')
    editLink.href =
      `/technicians/${technician.techId}/edit`
    editLink.textContent = 'Edit'

    const deactivateButton =
      document.createElement('button')

    deactivateButton.type = 'button'
    deactivateButton.classList.add(
      'btn',
      'btn-danger'
    )
    deactivateButton.textContent = 'Deactivate'
    deactivateButton.dataset.technicianId =
      technician.techId

    if (!technician.user?.isActive) {
      deactivateButton.disabled = true
      deactivateButton.textContent = 'Inactive'
    }

    deactivateButton.addEventListener(
      'click',
      handleDeactivateTechnician
    )

    buttonGroup.append(
      editLink,
      deactivateButton
    )

    actionCell.appendChild(buttonGroup)

    row.append(
      firstNameCell,
      lastNameCell,
      emailCell,
      phoneCell,
      statusCell,
      actionCell
    )

    tableBody.appendChild(row)
  }
}

const loadTechnicians = async () => {
  const result = await apiRequest(
    API_ROUTES.TECHNICIANS,
    {},
    'Failed to load technicians'
  )

  renderTechnicians(result.data)
}

const handleDeactivateTechnician = async (event) => {
  const button = event.currentTarget
  const technicianId = button.dataset.technicianId

  const confirmed = await confirmDelete({
    itemLabel: 'Technician'
  })

  if (!confirmed) {
    return
  }

  try {
    button.disabled = true

    await apiRequest(
      `${API_ROUTES.TECHNICIANS}/${technicianId}`,
      {
        method: 'DELETE'
      },
      'Failed to deactivate technician'
    )

    setFlashNotification(
      'success',
      'Technician was deactivated successfully!'
    )

    window.location.reload()
  } catch (error) {
    button.disabled = false
    showError(error.message)
  }
}

const init = async () => {
  try {
    const authState = await requireRole('admin')

    if (!authState) {
      return
    }

    await loadTechnicians()

    showFlashNotification()
  } catch (error) {
    console.error(
      'Unable to load technicians:',
      error
    )

    errorElement.textContent =
      error.message || 'Unable to load technicians.'

    errorElement.hidden = false
  }
}

init()
