import productService from '../../services/product.service.js'

// GET /api/products
export const getAllProducts = async (req, res) => {
  const products = await productService.getAllProducts()

  return res.status(200).json({
    success: true,
    data: products
  })
}

// GET /api/products/:productCode
export const getProductByCode = async (req, res) => {
  const { productCode } = req.validated.params

  const product = await productService.getProductByCode(productCode)

  return res.status(200).json({
    success: true,
    data: product
  })
}

// POST /api/products
export const createProduct = async (req, res) => {
  const product = await productService.createProduct(req.validated.body)

  return res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: product
  })
}

// PATCH /api/products/:productCode
export const updateProduct = async (req, res) => {
  const { productCode } = req.validated.params

  const product = await productService.updateProduct(productCode, req.validated.body)

  return res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    data: product
  })
}

// DELETE /api/products/:productCode
export const deleteProduct = async (req, res) => {
  const { productCode } = req.validated.params

  await productService.deleteProduct(productCode)

  return res.status(200).json({
    success: true,
    message: 'Product deleted successfully'
  })
}
