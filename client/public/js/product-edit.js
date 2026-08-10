import { requireRole } from './auth/auth-guard.js'
import { API_ROUTES, PAGE_ROUTES } from './constants/routes.js'
import { apiRequest } from './utils/api.js'
import { setFlashNotification, showError } from './utils/notification.js'

const form = document.querySelector('#product-edit-form')

const errorElement = document.querySelector('#product-edit-error')

const nameInput = document.querySelector('#name')

const versionInput = document.querySelector('#version')

const releaseDateInput = document.querySelector('#releaseDate')

const getProductCode = () => {
  const parts = window.location.pathname.split('/').filter(Boolean)

  return parts[1]
}

const populateForm = (product) => {
  nameInput.value = product.name ?? ''

  versionInput.value = product.version ?? ''

  releaseDateInput.value = product.releaseDate?.slice(0, 10) ?? ''
}

const loadProduct = async (productCode) => {
  const result = await apiRequest(`${API_ROUTES.PRODUCTS}/${productCode}`, {}, 'Failed to load product')

  populateForm(result.data)
}

const handleSubmit = async (event) => {
  event.preventDefault()

  const productCode = getProductCode()

  const productData = {
    name: nameInput.value.trim(),
    version: Number(versionInput.value),
    releaseDate: releaseDateInput.value
  }

  try {
    await apiRequest(
      `${API_ROUTES.PRODUCTS}/${productCode}`,
      {
        method: 'PATCH',
        body: JSON.stringify(productData)
      },
      'Failed to update product'
    )

    setFlashNotification('success', `Product "${productCode}" was updated successfully!`)

    window.location.href = PAGE_ROUTES.PRODUCTS
  } catch (error) {
    console.error('Error editing product:', error)

    showError(error.message)
  }
}

const init = async () => {
  try {
    const authState = await requireRole('admin')

    if (!authState) {
      return
    }

    const productCode = getProductCode()

    await loadProduct(productCode)

    form.addEventListener('submit', handleSubmit)
  } catch (error) {
    console.error('Unable to load product:', error)

    errorElement.textContent = error.message || 'Unable to load product.'

    errorElement.hidden = false
  }
}

init()
