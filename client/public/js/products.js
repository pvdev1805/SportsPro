const productCreateForm = document.querySelector('#product-create-form')

const createProduct = async (productData) => {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(productData)
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error?.message || result.message || 'Failed to create product')
  }

  return result.data
}

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
    await createProduct(productData)

    window.location.href = '/products'
  } catch (error) {
    console.error('Error creating product:', error)
    window.alert(`Error creating product: ${error.message}`)
  }
}

if (productCreateForm) {
  productCreateForm.addEventListener('submit', handleCreateProduct)
}
