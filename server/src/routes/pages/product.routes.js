import { Router } from 'express'

import * as productController from '../../controllers/pages/product.controller.js'
import validate from '../../middlewares/validate.middleware.js'
import { productCodeParamsOnlySchema } from '../../validators/product.validator.js'

const router = Router()

router.get('/', productController.renderProductPage)

router.get('/create', productController.renderProductCreatePage)

router.get('/:productCode/edit', validate(productCodeParamsOnlySchema), productController.renderProductEditPage)

export default router
