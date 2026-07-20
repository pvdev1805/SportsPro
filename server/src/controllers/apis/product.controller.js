import productService from '../../services/product.service.js'

// GET /api/products
export const getAllProducts = async (req, res) => {
  const products = await productService.getAllProducts()

  res.status(200).json({
    success: true,
    data: products
  })
}

// GET /api/products/:productCode
export const getProductByCode = async (req, res) => {
  const { productCode } = req.params
  const product = await productService.getProductByCode(productCode)

  res.status(200).json({
    success: true,
    data: product
  })
}

// POST /api/products
export const createProduct = async (req, res) => {
  const productData = req.body
  const product = await productService.createProduct(productData)

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: product
  })
}

// PUT /api/products/:productCode
export const updateProduct = async (req, res) => {
  const { productCode } = req.params

  const productData = req.body

  const product = await productService.updateProduct(productCode, productData)

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    data: product
  })
}

// DELETE /api/products/:productCode
export const deleteProduct = async (req, res) => {
  const { productCode } = req.params

  await productService.deleteProduct(productCode)

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully'
  })
}
