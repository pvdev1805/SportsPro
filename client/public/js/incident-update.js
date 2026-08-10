import { requireAuth } from './auth/auth-guard.js'
import { API_ROUTES } from './constants/routes.js'
import { apiRequest } from './utils/api.js'
import { setFlashNotification } from './utils/notification.js'

const loadingElement = document.querySelector('#incident-loading')
const contentElement = document.querySelector('#incident-content')
const errorElement = document.querySelector('#incident-update-error')

const pageTitle = document.querySelector('#incident-update-title')
const formTitle = document.querySelector('#incident-form-title')

const incidentIdElement = document.querySelector('#incident-id')
const customerElement = document.querySelector('#incident-customer')
const technicianElement = document.querySelector('#incident-technician')
const statusElement = document.querySelector('#incident-status')
const dateOpenedElement = document.querySelector('#incident-date-opened')
const dateClosedElement = document.querySelector('#incident-date-closed')

const updateForm = document.querySelector('#incident-update-form')
const productSelect = document.querySelector('#productCode')
const titleInput = document.querySelector('#title')
const descriptionInput = document.querySelector('#description')
const saveButton = document.querySelector('#save-incident-button')
const contentUpdateActions = document.querySelector('#content-update-actions')

const statusPanel = document.querySelector('#status-panel')
const statusDescription = document.querySelector('#status-description')
const statusButton = document.querySelector('#status-update-button')

let authState = null
let incident = null

const STATUS_TRANSITIONS = Object.freeze({
  assigned: 'in_progress',
  in_progress: 'resolved',
  resolved: 'closed'
})

const STATUS_ACTION_LABELS = Object.freeze({
  in_progress: 'Start Work',
  resolved: 'Resolve Incident',
  closed: 'Close Incident'
})

const formatStatus = (status) => {
  if (!status) {
    return '-'
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

const getIncidentIdFromUrl = () => {
  const segments = window.location.pathname.split('/').filter(Boolean)

  if (segments.length !== 3 || segments[0] !== 'incidents' || segments[2] !== 'edit') {
    return null
  }

  const incidentId = Number(segments[1])

  if (!Number.isInteger(incidentId) || incidentId <= 0) {
    return null
  }

  return incidentId
}

const getCustomerName = (customer) => {
  if (!customer) {
    return '-'
  }

  return `${customer.firstName} ${customer.lastName}`
}

const getTechnicianName = (technician) => {
  if (!technician) {
    return 'Unassigned'
  }

  return `${technician.firstName} ${technician.lastName}`
}

const showPageError = (message) => {
  errorElement.textContent = message
  errorElement.hidden = false
}

const populateProducts = (products) => {
  productSelect.replaceChildren()

  for (const product of products) {
    const option = document.createElement('option')

    option.value = product.productCode
    option.textContent = `${product.productCode} - ${product.name}`

    productSelect.appendChild(option)
  }
}

const populateIncident = () => {
  incidentIdElement.textContent = incident.incidentId
  customerElement.textContent = getCustomerName(incident.customer)
  technicianElement.textContent = getTechnicianName(incident.technician)
  statusElement.textContent = formatStatus(incident.status)
  dateOpenedElement.textContent = formatDateTime(incident.dateOpened)
  dateClosedElement.textContent = formatDateTime(incident.dateClosed)

  productSelect.value = incident.productCode
  titleInput.value = incident.title ?? ''
  descriptionInput.value = incident.description ?? ''
}

const disableContentEditing = () => {
  productSelect.disabled = true
  titleInput.readOnly = true
  descriptionInput.readOnly = true
  contentUpdateActions.hidden = true
}

const configureContentPermissions = (role) => {
  if (incident.status === 'closed') {
    formTitle.textContent = 'Incident Details'
    disableContentEditing()
    return
  }

  switch (role) {
    case 'admin':
      formTitle.textContent = 'Update Incident'
      break

    case 'technician':
      formTitle.textContent = 'Update Incident'

      productSelect.disabled = true
      titleInput.readOnly = true
      break

    case 'customer':
      if (incident.status === 'open') {
        formTitle.textContent = 'Edit Incident'
      } else {
        formTitle.textContent = 'Incident Details'
        disableContentEditing()
      }

      break

    default:
      disableContentEditing()
  }
}

const configureStatusAction = (role) => {
  statusPanel.hidden = true

  const nextStatus = STATUS_TRANSITIONS[incident.status]

  if (!nextStatus) {
    return
  }

  const technicianCanUpdate =
    role === 'technician' && (incident.status === 'assigned' || incident.status === 'in_progress')

  const adminCanUpdate = role === 'admin'

  if (!technicianCanUpdate && !adminCanUpdate) {
    return
  }

  statusDescription.textContent =
    `Current status: ${formatStatus(incident.status)}. ` + `Next status: ${formatStatus(nextStatus)}.`

  statusButton.textContent = STATUS_ACTION_LABELS[nextStatus] ?? `Change to ${formatStatus(nextStatus)}`

  statusButton.dataset.nextStatus = nextStatus

  statusPanel.hidden = false
}

const buildUpdatePayload = (role) => {
  if (role === 'technician') {
    return {
      description: descriptionInput.value.trim()
    }
  }

  return {
    productCode: productSelect.value,
    title: titleInput.value.trim(),
    description: descriptionInput.value.trim()
  }
}

const handleContentUpdate = async (event) => {
  event.preventDefault()

  if (!incident || !authState) {
    return
  }

  const role = authState.user.role

  if (role === 'customer' && incident.status !== 'open') {
    return
  }

  const updateData = buildUpdatePayload(role)

  saveButton.disabled = true
  saveButton.textContent = 'Saving...'

  try {
    await apiRequest(
      `${API_ROUTES.INCIDENTS}/${incident.incidentId}`,
      {
        method: 'PATCH',
        body: JSON.stringify(updateData)
      },
      'Failed to update incident'
    )

    setFlashNotification('success', `Incident #${incident.incidentId} was updated successfully!`)

    window.location.href = '/incidents'
  } catch (error) {
    console.error('Error updating incident:', error)

    showPageError(error.message)
  } finally {
    saveButton.disabled = false
    saveButton.textContent = 'Save Changes'
  }
}

const handleStatusUpdate = async () => {
  const nextStatus = statusButton.dataset.nextStatus

  if (!nextStatus || !incident) {
    return
  }

  statusButton.disabled = true

  const originalText = statusButton.textContent
  statusButton.textContent = 'Updating...'

  try {
    await apiRequest(
      `${API_ROUTES.INCIDENTS}/${incident.incidentId}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          status: nextStatus
        })
      },
      'Failed to update incident status'
    )

    setFlashNotification(
      'success',
      `Incident #${incident.incidentId} status was updated to ${formatStatus(nextStatus)}.`
    )

    window.location.href = '/incidents'
  } catch (error) {
    console.error('Error updating incident status:', error)

    showPageError(error.message)

    statusButton.disabled = false
    statusButton.textContent = originalText
  }
}

const loadIncident = async (incidentId) => {
  const result = await apiRequest(`${API_ROUTES.INCIDENTS}/${incidentId}`, {}, 'Failed to load incident')

  incident = result.data
}

const loadProducts = async () => {
  const result = await apiRequest(API_ROUTES.PRODUCTS, {}, 'Failed to load products')

  populateProducts(result.data ?? [])
}

const init = async () => {
  try {
    authState = await requireAuth()

    if (!authState) {
      return
    }

    const incidentId = getIncidentIdFromUrl()

    if (!incidentId) {
      throw new Error('Invalid incident ID')
    }

    await Promise.all([loadIncident(incidentId), loadProducts()])

    pageTitle.textContent = `Incident #${incident.incidentId}`

    populateIncident()
    configureContentPermissions(authState.user.role)
    configureStatusAction(authState.user.role)

    loadingElement.hidden = true
    contentElement.hidden = false

    updateForm.addEventListener('submit', handleContentUpdate)
    statusButton.addEventListener('click', handleStatusUpdate)
  } catch (error) {
    console.error('Unable to initialize incident page:', error)

    loadingElement.hidden = true

    showPageError(error.message || 'Unable to load incident.')
  }
}

init()
