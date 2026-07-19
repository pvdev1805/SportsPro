import { Router } from 'express'
import * as productController from '../../controllers/apis/product.controller.js'
import asyncHandler from '../../utils/async-handler.js'

const router = Router()

router.get('/', asyncHandler(productController.getAllProducts))
router.get('/:productCode', asyncHandler(productController.getProductByCode))
router.post('/', asyncHandler(productController.createProduct))
router.put('/:productCode', asyncHandler(productController.updateProduct))
router.delete('/:productCode', asyncHandler(productController.deleteProduct))

export default router
