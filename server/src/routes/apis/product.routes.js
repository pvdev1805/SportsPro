import { Router } from 'express'
import * as productController from '../../controllers/apis/product.controller.js'

const router = Router()

router.get('/', productController.getAllProducts)
router.get('/:code', productController.getProductByCode)
router.post('/', productController.createProduct)
router.put('/:code', productController.updateProduct)
router.delete('/:code', productController.deleteProduct)

export default router
