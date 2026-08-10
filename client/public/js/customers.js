import { requireRole } from './auth/auth-guard.js'
import { API_ROUTES } from './constants/routes.js'
import { apiRequest } from './utils/api.js'
import { showError, showFlashNotification } from './utils/notification.js'

const searchForm = document.querySelector('#customer-search-form')

const searchInput = document.querySelector('#customer-last-name')

const resultsBody = document.querySelector('#customer-results-body')

const resultsTable = document.querySelector('#customer-results-table')

const noResultsMessage = document.querySelector('#customer-no-results')

const errorElement = document.querySelector('#customers-error')

const renderCustomers = (customers) => {
  resultsBody.replaceChildren()

  if (customers.length === 0) {
    resultsTable.hidden = true
    noResultsMessage.hidden = false
    return
  }

  resultsTable.hidden = false
  noResultsMessage.hidden = true

  for (const customer of customers) {
    const row = document.createElement('tr')

    const nameCell = document.createElement('td')
    nameCell.textContent = `${customer.firstName} ${customer.lastName}`

    const emailCell = document.createElement('td')
    emailCell.textContent = customer.user?.email ?? ''

    const phoneCell = document.createElement('td')
    phoneCell.textContent = customer.phone ?? ''

    const actionCell = document.createElement('td')

    const editLink = document.createElement('a')
    editLink.classList.add('btn', 'btn-primary')
    editLink.href = `/customers/${customer.customerId}/edit`
    editLink.textContent = 'View/Edit'

    actionCell.appendChild(editLink)

    row.append(nameCell, emailCell, phoneCell, actionCell)

    resultsBody.appendChild(row)
  }
}

const loadCustomers = async () => {
  const result = await apiRequest(API_ROUTES.CUSTOMERS, {}, 'Failed to load customers')

  renderCustomers(result.data)
}

const handleSearch = async (event) => {
  event.preventDefault()

  const lastName = searchInput.value.trim()

  try {
    if (!lastName) {
      await loadCustomers()
      return
    }

    const result = await apiRequest(
      `${API_ROUTES.CUSTOMERS}/search?lastName=${encodeURIComponent(lastName)}`,
      {},
      'Failed to search customers'
    )

    renderCustomers(result.data)
  } catch (error) {
    console.error('Error searching customers:', error)

    showError(error.message)
  }
}

const init = async () => {
  try {
    const authState = await requireRole('admin')

    if (!authState) {
      return
    }

    searchForm.addEventListener('submit', handleSearch)

    await loadCustomers()

    showFlashNotification()
  } catch (error) {
    console.error('Unable to load customers:', error)

    errorElement.textContent = error.message || 'Unable to load customers.'

    errorElement.hidden = false
  }
}

init()
