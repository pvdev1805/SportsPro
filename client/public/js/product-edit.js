const productEditForm = document.querySelector('#product-edit-form')

const editProduct = async (productCode, productData) => {
  const response = await fetch(`/api/products/${productCode}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(productData)
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error?.message || result.message || 'Failed to update product')
  }

  return result.data
}

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
    await editProduct(productCode, productData)

    window.location.href = '/products'
  } catch (error) {
    console.error('Error editing product:', error)
    window.alert(`Error editing product: ${error.message}`)
  }
}

if (productEditForm) {
  productEditForm.addEventListener('submit', handleEditProduct)
}
