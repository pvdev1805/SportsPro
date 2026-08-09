import productService from '../../services/product.service.js'

// GET /products
export const renderProductPage = async (req, res) => {
  const products = await productService.getAllProducts()

  return res.render('pages/products', {
    title: 'Manage Products',
    products
  })
}

// GET /products/create
export const renderProductCreatePage = (req, res) => {
  return res.render('pages/product-create', {
    title: 'Add Product'
  })
}

// GET /products/:productCode/edit
export const renderProductEditPage = async (req, res) => {
  const { productCode } = req.validated.params

  const product = await productService.getProductByCode(productCode)

  return res.render('pages/product-edit', {
    title: 'Edit Product',
    product
  })
}
