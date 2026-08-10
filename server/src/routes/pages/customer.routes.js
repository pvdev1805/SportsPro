import { Router } from 'express'

import * as customerController from '../../controllers/pages/customer.controller.js'
import validate from '../../middlewares/validate.middleware.js'
import { customerIdParamsOnlySchema } from '../../validators/customer.validator.js'

const router = Router()

router.get('/', customerController.renderCustomerPage)

router.get('/:customerId/edit', validate(customerIdParamsOnlySchema), customerController.renderCustomerEditPage)

export default router
