import { Router } from 'express'
import * as productController from '../../controllers/pages/product.controller.js'

const router = Router()

router.get('/', productController.renderProductPage)

export default router
