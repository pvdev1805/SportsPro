import { Router } from 'express'
import * as productController from '../../controllers/pages/product.controller.js'
import asyncHandler from '../../utils/async-handler.js'

const router = Router()

router.get('/', asyncHandler(productController.renderProductPage))
router.get('/create', asyncHandler(productController.renderProductCreatePage))
router.get('/:productCode/edit', asyncHandler(productController.renderProductEditPage))

export default router
