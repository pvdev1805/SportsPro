import { apiRequest } from './utils/api.js'
import { setFlashNotification, showError } from './utils/notification.js'

const productEditForm = document.querySelector('#product-edit-form')

const handleEditProduct = async (event) => {
  event.preventDefault()

  const formData = new FormData(productEditForm)

  const productCode = productEditForm.dataset.productCode

  const productData = {
    name: formData.get('name').trim(),
    version: Number(formData.get('version')),
    releaseDate: formData.get('releaseDate')
  }

  try {
    await apiRequest(
      `/api/products/${productCode}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      },
      'Failed to update product'
    )

    setFlashNotification('success', `Product "${productCode}" was updated successfully!`)

    window.location.href = '/products'
  } catch (error) {
    console.error('Error editing product:', error)
    showError(error.message)
  }
}

if (productEditForm) {
  productEditForm.addEventListener('submit', handleEditProduct)
}
