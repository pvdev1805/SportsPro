import Product from '../models/product.model.js'
import { ConflictError, NotFoundError } from '../utils/app-error.js'

const getAllProducts = async () => {
  const products = await Product.findAll({
    order: [['productCode', 'ASC']]
  })

  return products
}

const getProductByCode = async (productCode) => {
  const product = await Product.findByPk(productCode)

  if (!product) {
    throw new NotFoundError(`Product with code "${productCode}" not found`)
  }

  return product
}

const createProduct = async (productData) => {
  const existingProduct = await Product.findByPk(productData.productCode)

  if (existingProduct) {
    throw new ConflictError(`Product with code "${productData.productCode}" already exists`)
  }

  const product = await Product.create(productData)
  return product
}

const updateProduct = async (productCode, productData) => {
  const product = await getProductByCode(productCode)

  const updateData = {
    name: productData.name,
    version: productData.version,
    releaseDate: productData.releaseDate
  }

  await product.update(updateData)

  return product
}

const deleteProduct = async (productCode) => {
  const product = await getProductByCode(productCode)

  await product.destroy()
}

const productService = {
  getAllProducts,
  getProductByCode,
  createProduct,
  updateProduct,
  deleteProduct
}

export default productService
