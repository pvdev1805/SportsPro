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

  const confirmed = window.confirm(`Are you sure you want to delete product with code "${productCode}"?`)

  if (!confirmed) {
    return
  }

  try {
    await deleteProduct(productCode)
    window.location.reload()
  } catch (error) {
    console.error('Error deleting product:', error)
    window.alert(`Error deleting product: ${error.message}`)
  }
}

if (deleteButtons) {
  deleteButtons.forEach((button) => {
    button.addEventListener('click', handleDeleteProduct)
  })
}
