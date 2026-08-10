// GET /products
export const renderProductPage = (req, res) => {
  return res.render('pages/products', {
    title: 'Manage Products'
  })
}

// GET /products/create
export const renderProductCreatePage = (req, res) => {
  return res.render('pages/product-create', {
    title: 'Add Product'
  })
}

// GET /products/:productCode/edit
export const renderProductEditPage = (req, res) => {
  return res.render('pages/product-edit', {
    title: 'Edit Product'
  })
}
