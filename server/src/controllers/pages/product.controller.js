import productService from '../../services/product.service.js'

// GET /products
export const renderProductPage = async (req, res) => {
  const products = await productService.getAllProducts()

  res.render('pages/products', {
    title: 'Manage Products',
    products
  })
}
