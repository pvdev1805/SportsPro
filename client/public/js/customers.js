import { API_ROUTES } from './constants/routes.js'
import { apiRequest } from './utils/api.js'
import { showError, showFlashNotification } from './utils/notification.js'

const searchForm = document.querySelector('#customer-search-form')
const searchInput = document.querySelector('#customer-last-name')
const resultsBody = document.querySelector('#customer-results-body')
const resultsTable = document.querySelector('#customer-results-table')
const noResultsMessage = document.querySelector('#customer-no-results')

const renderCustomers = (customers) => {
  resultsBody.innerHTML = ''

  if (customers.length === 0) {
    resultsTable.hidden = true
    noResultsMessage.hidden = false
    return
  }

  resultsTable.hidden = false
  noResultsMessage.hidden = true

  customers.forEach((customer) => {
    const row = document.createElement('tr')

    const nameCell = document.createElement('td')
    nameCell.textContent = `${customer.firstName} ${customer.lastName}`

    const emailCell = document.createElement('td')
    emailCell.textContent = customer.email

    const phoneCell = document.createElement('td')
    phoneCell.textContent = customer.phone

    const actionCell = document.createElement('td')
    const editLink = document.createElement('a')

    editLink.className = 'btn btn-primary'
    editLink.href = `/customers/${customer.customerId}/edit`
    editLink.textContent = 'View/Edit'

    actionCell.append(editLink)

    row.append(nameCell, emailCell, phoneCell, actionCell)
    resultsBody.append(row)
  })
}

const loadCustomers = async () => {
  try {
    const result = await apiRequest(API_ROUTES.CUSTOMERS, {}, 'Failed to load customers')

    renderCustomers(result.data)
  } catch (error) {
    showError(error.message)
  }
}

const handleSearch = async (event) => {
  event.preventDefault()

  const lastName = searchInput.value.trim()

  if (!lastName) {
    loadCustomers()
    return
  }

  try {
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

if (searchForm) {
  searchForm.addEventListener('submit', handleSearch)
}

resultsTable.hidden = true
noResultsMessage.hidden = true

showFlashNotification()

loadCustomers()
