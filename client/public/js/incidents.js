import { requireAuth } from './auth/auth-guard.js'
import { API_ROUTES } from './constants/routes.js'
import { apiRequest } from './utils/api.js'
import { showFlashNotification } from './utils/notification.js'

const pageTitle = document.querySelector('#incidents-page-title')

const table = document.querySelector('#incidents-table')

const tableBody = document.querySelector('#incidents-table-body')

const emptyMessage = document.querySelector('#incidents-empty')

const errorElement = document.querySelector('#incidents-error')

const createLink = document.querySelector('#incident-create-link')

const assignLink = document.querySelector('#incident-assign-link')

const formatStatus = (status) => {
  if (!status) {
    return ''
  }

  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const formatDateTime = (value) => {
  if (!value) {
    return '-'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('en-AU', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date)
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

const createActionCell = (incident, role) => {
  const cell = document.createElement('td')
  const buttonGroup = document.createElement('div')

  buttonGroup.classList.add('button-group')

  if (role === 'admin' || role === 'technician' || role === 'customer') {
    const editLink = document.createElement('a')

    editLink.classList.add('btn', 'btn-primary')

    editLink.href = `/incidents/update?incidentId=${incident.incidentId}`

    editLink.textContent = role === 'customer' ? 'View/Edit' : 'View/Update'

    buttonGroup.appendChild(editLink)
  }

  cell.appendChild(buttonGroup)

  return cell
}

const renderIncidents = (incidents, role) => {
  tableBody.replaceChildren()

  if (incidents.length === 0) {
    table.hidden = true
    emptyMessage.hidden = false
    return
  }

  emptyMessage.hidden = true
  table.hidden = false

  for (const incident of incidents) {
    const row = document.createElement('tr')

    const idCell = document.createElement('td')
    idCell.textContent = incident.incidentId

    const customerCell = document.createElement('td')
    customerCell.textContent = getCustomerName(incident)

    const productCell = document.createElement('td')
    productCell.textContent = incident.productCode

    const technicianCell = document.createElement('td')
    technicianCell.textContent = getTechnicianName(incident)

    const statusCell = document.createElement('td')
    statusCell.textContent = formatStatus(incident.status)

    const openedCell = document.createElement('td')
    openedCell.textContent = formatDateTime(incident.dateOpened)

    const closedCell = document.createElement('td')
    closedCell.textContent = formatDateTime(incident.dateClosed)

    const titleCell = document.createElement('td')
    titleCell.textContent = incident.title

    row.append(
      idCell,
      customerCell,
      productCell,
      technicianCell,
      statusCell,
      openedCell,
      closedCell,
      titleCell,
      createActionCell(incident, role)
    )

    tableBody.appendChild(row)
  }
}

const getIncidentEndpointForRole = (role) => {
  switch (role) {
    case 'admin':
      return API_ROUTES.INCIDENTS

    case 'technician':
      return `${API_ROUTES.INCIDENTS}/assigned`

    case 'customer':
      return `${API_ROUTES.INCIDENTS}/mine`

    default:
      return null
  }
}

const configurePageForRole = (role) => {
  switch (role) {
    case 'admin':
      pageTitle.textContent = 'All Incidents'
      createLink.hidden = false
      assignLink.hidden = false
      break

    case 'technician':
      pageTitle.textContent = 'Assigned Incidents'
      createLink.hidden = true
      assignLink.hidden = true
      break

    case 'customer':
      pageTitle.textContent = 'My Incidents'
      createLink.hidden = false
      assignLink.hidden = true
      break
  }
}

const loadIncidents = async (role) => {
  const endpoint = getIncidentEndpointForRole(role)

  if (!endpoint) {
    throw new Error('You do not have access to incidents')
  }

  const result = await apiRequest(endpoint, {}, 'Failed to load incidents')

  renderIncidents(result.data ?? [], role)
}

const init = async () => {
  try {
    const authState = await requireAuth()

    if (!authState) {
      return
    }

    const role = authState.user.role

    configurePageForRole(role)

    await loadIncidents(role)

    showFlashNotification()
  } catch (error) {
    console.error('Unable to load incidents:', error)

    errorElement.textContent = error.message || 'Unable to load incidents.'

    errorElement.hidden = false
  }
}

init()
