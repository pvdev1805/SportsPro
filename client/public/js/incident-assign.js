import { requireRole } from './auth/auth-guard.js'
import { API_ROUTES } from './constants/routes.js'
import { apiRequest } from './utils/api.js'
import { setFlashNotification, showError } from './utils/notification.js'

const errorElement = document.querySelector('#incident-assign-error')

const table = document.querySelector('#assign-incidents-table')

const tableBody = document.querySelector('#assign-incidents-body')

const emptyMessage = document.querySelector('#assign-empty-message')

const assignmentPanel = document.querySelector('#assignment-panel')

const assignmentForm = document.querySelector('#incident-assignment-form')

const technicianSelect = document.querySelector('#techId')

const submitButton = document.querySelector('#assign-submit')

const cancelButton = document.querySelector('#assign-cancel')

const selectedIncidentId = document.querySelector('#selected-incident-id')

const selectedCustomer = document.querySelector('#selected-customer')

const selectedProduct = document.querySelector('#selected-product')

const selectedStatus = document.querySelector('#selected-status')

const selectedTechnician = document.querySelector('#selected-technician')

const selectedTitle = document.querySelector('#selected-title')

let incidents = []
let selectedIncident = null

const formatStatus = (status) => {
  if (!status) {
    return ''
  }

  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const getCustomerName = (incident) => {
  if (!incident.customer) {
    return '-'
  }

  return `${incident.customer.firstName} ${incident.customer.lastName}`
}

const getTechnicianName = (incident) => {
  if (!incident.technician) {
    return 'Unassigned'
  }

  return `${incident.technician.firstName} ${incident.technician.lastName}`
}

const getAssignableIncidents = (allIncidents) => {
  return allIncidents.filter((incident) => incident.status === 'open' || incident.status === 'assigned')
}

const populateSelectedIncident = (incident) => {
  selectedIncidentId.textContent = incident.incidentId

  selectedCustomer.textContent = getCustomerName(incident)

  selectedProduct.textContent = incident.product
    ? `${incident.productCode} - ${incident.product.name}`
    : incident.productCode

  selectedStatus.textContent = formatStatus(incident.status)

  selectedTechnician.textContent = getTechnicianName(incident)

  selectedTitle.textContent = incident.title

  technicianSelect.value = incident.techId?.toString() ?? ''

  assignmentPanel.hidden = false
}

const handleSelectIncident = (incidentId) => {
  const incident = incidents.find((item) => item.incidentId === incidentId)

  if (!incident) {
    return
  }

  selectedIncident = incident
  populateSelectedIncident(incident)
}

const renderIncidents = (allIncidents) => {
  incidents = getAssignableIncidents(allIncidents)

  tableBody.replaceChildren()

  if (incidents.length === 0) {
    table.hidden = true
    emptyMessage.hidden = false
    assignmentPanel.hidden = true
    return
  }

  table.hidden = false
  emptyMessage.hidden = true

  for (const incident of incidents) {
    const row = document.createElement('tr')

    const idCell = document.createElement('td')
    idCell.textContent = incident.incidentId

    const customerCell = document.createElement('td')
    customerCell.textContent = getCustomerName(incident)

    const productCell = document.createElement('td')
    productCell.textContent = incident.productCode

    const statusCell = document.createElement('td')
    statusCell.textContent = formatStatus(incident.status)

    const technicianCell = document.createElement('td')
    technicianCell.textContent = getTechnicianName(incident)

    const openedCell = document.createElement('td')
    openedCell.textContent = incident.dateOpened
      ? new Intl.DateTimeFormat('en-AU').format(new Date(incident.dateOpened))
      : '-'

    const titleCell = document.createElement('td')
    titleCell.textContent = incident.title

    const actionCell = document.createElement('td')

    const selectButton = document.createElement('button')

    selectButton.type = 'button'
    selectButton.classList.add('btn', 'btn-primary')
    selectButton.textContent = incident.techId ? 'Reassign' : 'Select'

    selectButton.addEventListener('click', () => handleSelectIncident(incident.incidentId))

    actionCell.appendChild(selectButton)

    row.append(idCell, customerCell, productCell, statusCell, technicianCell, openedCell, titleCell, actionCell)

    tableBody.appendChild(row)
  }
}

const renderTechnicians = (technicians) => {
  technicianSelect.replaceChildren()

  const placeholder = document.createElement('option')

  placeholder.value = ''
  placeholder.textContent = '-- Select a Technician --'

  technicianSelect.appendChild(placeholder)

  for (const technician of technicians) {
    if (!technician.user?.isActive) {
      continue
    }

    const option = document.createElement('option')

    option.value = technician.techId
    option.textContent = `${technician.firstName} ${technician.lastName}`

    technicianSelect.appendChild(option)
  }
}

const loadAssignmentData = async () => {
  const [incidentsResult, techniciansResult] = await Promise.all([
    apiRequest(API_ROUTES.INCIDENTS, {}, 'Failed to load incidents'),
    apiRequest(API_ROUTES.TECHNICIANS, {}, 'Failed to load technicians')
  ])

  renderIncidents(incidentsResult.data ?? [])
  renderTechnicians(techniciansResult.data ?? [])
}

const setSubmitting = (isSubmitting) => {
  submitButton.disabled = isSubmitting
  submitButton.textContent = isSubmitting ? 'Assigning...' : 'Assign Incident'
}

const handleSubmit = async (event) => {
  event.preventDefault()

  if (!selectedIncident) {
    showError('Please select an incident')
    return
  }

  const techId = Number(technicianSelect.value)

  if (!Number.isInteger(techId) || techId <= 0) {
    showError('Please select a technician')
    return
  }

  setSubmitting(true)

  try {
    await apiRequest(
      `${API_ROUTES.INCIDENTS}/${selectedIncident.incidentId}/assign`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          techId
        })
      },
      'Failed to assign technician'
    )

    setFlashNotification('success', `Incident #${selectedIncident.incidentId} was assigned successfully!`)

    window.location.reload()
  } catch (error) {
    console.error('Error assigning incident:', error)

    showError(error.message)
  } finally {
    setSubmitting(false)
  }
}

const handleCancel = () => {
  selectedIncident = null
  technicianSelect.value = ''
  assignmentPanel.hidden = true
}

const init = async () => {
  try {
    const authState = await requireRole('admin')

    if (!authState) {
      return
    }

    await loadAssignmentData()

    assignmentForm.addEventListener('submit', handleSubmit)

    cancelButton.addEventListener('click', handleCancel)
  } catch (error) {
    console.error('Unable to initialize incident assignment:', error)

    errorElement.textContent = error.message || 'Unable to initialize incident assignment.'

    errorElement.hidden = false
  }
}

init()
