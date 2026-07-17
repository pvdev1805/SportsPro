const notImplemented = (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Product API has not been implemented yet.'
  })
}

export const getAllProducts = notImplemented
export const getProductByCode = notImplemented
export const createProduct = notImplemented
export const updateProduct = notImplemented
export const deleteProduct = notImplemented
