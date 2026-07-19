import { API_ROUTES, PAGE_ROUTES } from './constants/routes.js'
import { apiRequest } from './utils/api.js'
import { setFlashNotification, showError } from './utils/notification.js'

const productCreateForm = document.querySelector('#product-create-form')

const handleCreateProduct = async (event) => {
  event.preventDefault()

  const formData = new FormData(productCreateForm)

  const productData = {
    productCode: formData.get('productCode').trim(),
    name: formData.get('name').trim(),
    version: Number(formData.get('version')),
    releaseDate: formData.get('releaseDate')
  }

  try {
    await apiRequest(
      API_ROUTES.PRODUCTS,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      },
      'Failed to create product'
    )

    setFlashNotification('success', `Product "${productData.productCode}" was created successfully!`)

    window.location.href = PAGE_ROUTES.PRODUCTS
  } catch (error) {
    console.error('Error creating product:', error)
    showError(error.message)
  }
}

if (productCreateForm) {
  productCreateForm.addEventListener('submit', handleCreateProduct)
}
