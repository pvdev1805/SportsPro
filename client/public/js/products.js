import { apiRequest } from './utils/api.js'
import { confirmDelete } from './utils/confirmation.js'
import { setFlashNotification, showError, showFlashNotification } from './utils/notification.js'

const deleteButtons = document.querySelectorAll('.product-delete-button')

const handleDeleteProduct = async (event) => {
  const deleteButton = event.currentTarget

  const productCode = deleteButton.dataset.productCode

  const confirmed = await confirmDelete(productCode)

  if (!confirmed) {
    return
  }

  try {
    deleteButton.disabled = true

    await apiRequest(
      `/api/products/${productCode}`,
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

if (deleteButtons) {
  deleteButtons.forEach((button) => {
    button.addEventListener('click', handleDeleteProduct)
  })
}

showFlashNotification()
