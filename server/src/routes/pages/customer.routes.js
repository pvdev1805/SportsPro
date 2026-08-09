import { Router } from 'express'
import * as customerController from '../../controllers/pages/customer.controller.js'
import asyncHandler from '../../utils/async-handler.js'
import validate from '../../middlewares/validate.middleware.js'
import { customerIdParamsOnlySchema } from '../../validators/customer.validator.js'

const router = Router()

router.get('/', asyncHandler(customerController.renderCustomerPage))
router.get(
  '/:customerId/edit',
  validate(customerIdParamsOnlySchema),
  asyncHandler(customerController.renderCustomerEditPage)
)

export default router
