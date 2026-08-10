import { requireAuth } from './auth/auth-guard.js'
import { API_ROUTES } from './constants/routes.js'
import { apiRequest } from './utils/api.js'
import { confirmDelete } from './utils/confirmation.js'
import { setFlashNotification, showError, showFlashNotification } from './utils/notification.js'

const table = document.querySelector('#products-table')

const tableBody = document.querySelector('#products-table-body')

const addProductLink = document.querySelector('#add-product-link')

const actionsHeader = document.querySelector('#product-actions-header')

const errorElement = document.querySelector('#products-error')

const formatReleaseDate = (value) => {
  if (!value) {
    return ''
  }

  const date = new Date(`${value}T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('en-AU').format(date)
}

const createActionCell = (product) => {
  const actionCell = document.createElement('td')

  const buttonGroup = document.createElement('div')
  buttonGroup.classList.add('button-group')

  const editLink = document.createElement('a')
  editLink.classList.add('btn', 'btn-primary')
  editLink.href = `/products/${product.productCode}/edit`
  editLink.textContent = 'Edit'

  const deleteButton = document.createElement('button')
  deleteButton.type = 'button'
  deleteButton.classList.add('btn', 'btn-danger', 'product-delete-button')
  deleteButton.dataset.productCode = product.productCode
  deleteButton.textContent = 'Delete'

  deleteButton.addEventListener('click', handleDeleteProduct)

  buttonGroup.append(editLink, deleteButton)

  actionCell.appendChild(buttonGroup)

  return actionCell
}

const renderProducts = (products, isAdmin) => {
  tableBody.replaceChildren()

  for (const product of products) {
    const row = document.createElement('tr')

    const codeCell = document.createElement('td')
    codeCell.textContent = product.productCode

    const nameCell = document.createElement('td')
    nameCell.textContent = product.name

    const versionCell = document.createElement('td')
    versionCell.textContent = Number(product.version).toFixed(1)

    const releaseDateCell = document.createElement('td')

    releaseDateCell.textContent = formatReleaseDate(product.releaseDate)

    row.append(codeCell, nameCell, versionCell, releaseDateCell)

    if (isAdmin) {
      row.appendChild(createActionCell(product))
    }

    tableBody.appendChild(row)
  }

  table.hidden = false
}

const loadProducts = async (isAdmin) => {
  const result = await apiRequest(API_ROUTES.PRODUCTS, {}, 'Failed to load products')

  renderProducts(result.data, isAdmin)
}

const handleDeleteProduct = async (event) => {
  const deleteButton = event.currentTarget
  const productCode = deleteButton.dataset.productCode

  const confirmed = await confirmDelete({
    itemLabel: 'Product',
    itemName: productCode
  })

  if (!confirmed) {
    return
  }

  try {
    deleteButton.disabled = true

    await apiRequest(
      `${API_ROUTES.PRODUCTS}/${productCode}`,
      {
        method: 'DELETE'
      },
      'Failed to delete product'
    )

    setFlashNotification('success', `Product "${productCode}" was deleted successfully!`)

    window.location.reload()
  } catch (error) {
    deleteButton.disabled = false

    console.error('Error deleting product:', error)

    showError(error.message)
  }
}

const init = async () => {
  try {
    const authState = await requireAuth()

    if (!authState) {
      return
    }

    const isAdmin = authState.user.role === 'admin'

    addProductLink.hidden = !isAdmin
    actionsHeader.hidden = !isAdmin

    await loadProducts(isAdmin)

    showFlashNotification()
  } catch (error) {
    console.error('Unable to load products:', error)

    errorElement.textContent = error.message || 'Unable to load products.'

    errorElement.hidden = false
  }
}

init()
