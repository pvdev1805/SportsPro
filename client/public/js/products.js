import { confirmDelete } from './utils/confirmation.js'
import { setFlashNotification, showError, showFlashNotification } from './utils/notification.js'

const deleteButtons = document.querySelectorAll('.product-delete-button')

const deleteProduct = async (productCode) => {
  const response = await fetch(`/api/products/${productCode}`, {
    method: 'DELETE'
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error?.message || result.message || 'Failed to delete product')
  }

  return result
}

const handleDeleteProduct = async (event) => {
  const deleteButton = event.currentTarget

  const productCode = deleteButton.dataset.productCode

  const confirmed = await confirmDelete(productCode)

  if (!confirmed) {
    return
  }

  try {
    deleteButton.disabled = true
    await deleteProduct(productCode)
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
